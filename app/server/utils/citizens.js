import { readQuery, writeQuery } from "./neo4j"
import { getOrganization, orgAddMember, orgAddFounder, orgAddAffiliate } from "./orgs"
import * as rsi from "./rsi"
import { parseStatus } from "./status"

export const getCitizen = async (handle, create = false, user = null) => {
    // try to load citizen from neo4j
    let citizen = await loadCitizen(handle, user)

    // if citizen isn't created yet, fetch the data from rsi and create it
    if(citizen && Object.keys(citizen).length === 0) {
        citizen = await rsi.fetchCitizen(handle)

        // added a check for random citizens without a record number. Not sure why they exist.
        if (citizen && create) {
            if (!citizen.record.startsWith('#')) {
                citizen.record = '#000000'
            }
            if(user && user.verified == 1 && user.handle.toUpperCase() == citizen.handle.toUpperCase()) {
                citizen.verified = true
            } else {
                citizen.verified = false
            }
            logActivity('API', `Creating Citizen: ${citizen.handle}`, user ? user.handle : 'Anonymous')
            await createCitizen(citizen)
        }
    } else {
        //TODO: Transition this to using the graph, rather than polling RSI every time.
        citizen.orgs = await getCitizenOrgs(handle)
        // check and update verification, but only if this is our own citizen record
        if (user && user.handle.toUpperCase() == citizen.handle.toUpperCase()) {
            // sync data automatically every 12 hours
            if (citizen.updated && (new Date() - new Date(citizen.updated) > 43200000)) { // longer ago than 12 hours
                console.log('Auto-syncing citizen data for citizen', citizen.handle)
                citizen = await updateCitizen(await rsi.fetchCitizen(citizen.handle))
            }

            console.log('checking/fixing verification status', user)
            console.log(citizen.verified)
            if (user && user.verified == 1 && citizen.verified == false) {
                citizen.verified = true
                logActivity('API-ACTION', `Updating Citizen: ${citizen.handle}`, user.handle)
                updateCitizen(citizen)
            } else if (user && user.verified == 0 && citizen.verified == true) {
                citizen.verified = false
                logActivity('API-ACTION', `Updating Citizen: ${citizen.handle}`, user.handle)
                updateCitizen(citizen)
            }
        }
        
    }

    return citizen
}

async function loadCitizen(handle, user) {
    console.log('loading citizen: ' + handle)
    const query = 
        `MATCH (c:Citizen)-[s:HAS_STATUS]->(:Status {type: 'active'})
         WHERE c.id =~ $handle
         call {
            WITH c
            OPTIONAL MATCH (c)-[r:FRIENDS_WITH]->(u:Citizen)
            WHERE u.id =~ $user
            return r.confirmed as received
         }
         call {
            WITH c
            OPTIONAL MATCH (c)<-[s:FRIENDS_WITH]-(u:Citizen)
            WHERE u.id =~ $user
            RETURN s.confirmed as sent
         }
         
         return c as citizen, s.updated as status, sent, received`
    const params = {
        handle: '(?i)' + handle.toUpperCase(),
        user: ''
    }

    if (user) {
        params.user = '(?i)'+user.handle.toUpperCase()
    }

    const {result, error} = await readQuery(query, params)

    if (error) {
        return null
    }

    let citizen = {}
    if(result[0]) {
        citizen = result[0].citizen
        citizen.status = parseStatus(result[0].status)
        if (result[0].sent != null) {
            if (result[0].sent) {
                citizen.friendship = 'confirmed'
            } else {
                citizen.friendship = 'requested'
            }
        } else if (result[0].received != null) {
            if (result[0].received) {
                citizen.friendship = 'confirmed'
            } else {
                citizen.friendship = 'received'
            }
        }
    }
    return citizen
}

//TODO: combine this query above
const getCitizenOrgs = async (handle) => {
    const query = `
        MATCH (o:Organization)<-[m:MEMBER_OF]-(c:Citizen)
        WHERE c.id =~ $handle
        return o as org, m as membership, type(m) as type
    `
    const { result, error } = await readQuery(query, {
        handle: '(?i)'+handle
    })

    const orgs = {
        main: {},
        affiliated: []
    }

    if (error) {
        return orgs
    }
    for (const res of result) {
        const org = {
            id: res.org.id,
            name: res.org.name,
            logo: res.org.logo,
            rank: {
                title: res.membership.title,
                level: res.membership.rank
            }
        }
        if (res.type == 'MEMBER_OF') {
            orgs.main = org
        } else {
            orgs.affiliated.push(org)
        }
    }
    return orgs
}

async function createCitizen(citizen) {
    console.log("Creating Citizen: ", citizen.handle)
    // first, save the actual citizen
    const query = 
        `MATCH (s:Status {type: 'active'})
        MERGE (c:Citizen {
            handle: $handle,
            id: $id,
            name: $name,
            record: $record,
            enlisted: $enlisted,
            verified: $verified,
            portrait: $portrait,
            bio: $bio,
            website: $website
        })-[:HAS_STATUS {updated: '1979'}]->(s)`

    const params = {
        handle: citizen.handle,
        id: citizen.handle.toUpperCase(),
        name: citizen.name,
        record: citizen.record ?? '000000',
        enlisted: citizen.enlisted,
        verified: citizen.verified,
        portrait: citizen.portrait,
        bio: citizen.bio,
        website: citizen.website ?? ''
    }
    await writeQuery(query, params)

    // then, if they are part of an org, see if the ORG already exists, if not, add that too
    if(citizen.orgs.main) {
        console.log("Found org, adding as member")
        const mainOrg = citizen.orgs.main
        const org = await getOrganization(mainOrg.id, true)
        //FIXME: Fix the camelcase, and change this to org_rank when that part is fixed.
        await orgAddMember(citizen.handle, mainOrg.id, mainOrg.rank.level, mainOrg.rank.title)

        if (org.founders && org.founders.find(item => item.handle === citizen.handle)) {
            await orgAddFounder(citizen.handle, mainOrg.id)
        }
    }
    if (citizen.orgs.affiliated.length > 0) {
        console.log("Adding affiliate org")
        for (const affOrg of citizen.orgs.affiliated) {
            if (affOrg.id) { // catching redacted orgs
                const org = await getOrganization(affOrg.id, true)
                await orgAddAffiliate(citizen.handle, affOrg.id, affOrg.rank.level, affOrg.rank.title)
            }
            
        }
    }
}

export const updateCitizen = async (data) => {
    console.log('UPDATING citizen')
    const query = 
        `MATCH (c:Citizen)
         WHERE c.id =~ $handle
         SET c += {
            name: $name,
            verified: $verified,
            bio: $bio,
            website: $website,
            portrait: $portrait,
            updated: datetime()
         }
         return c as citizen`
    
    const params = {
        handle: '(?i)'+data.handle,
        name: data.name,
        verified: data.verified,
        bio: data.bio,
        portrait: data.portrait,
        website: data.website ?? ''
    }

    const { error, result } = await writeQuery(query, params)
    if (error) {
        console.error(error)
    }

    const citizen = result[0].citizen
    citizen.orgs = data.orgs

    // need to remove org links first
    const detachMember = `
        MATCH (c:Citizen)
        WHERE c.id =~ $handle
        MATCH (c)-[m:MEMBER_OF|AFFILIATE_OF|OWNER_OF]->(o:Organization)
        DELETE m
    `

    await writeQuery(detachMember, {
        handle: '(?i)' + citizen.handle
    })

    // then, if they are part of an org, see if the ORG already exists, if not, add that too
    if (citizen.orgs) {
        if(citizen.orgs.main) {
            console.log("Found org, adding as member: ", citizen.orgs.main)
            const mainOrg = citizen.orgs.main
            const org = await fetchOrg(mainOrg.id)

            console.log(org)
            //FIXME: Fix the camelcase, and change this to org_rank when that part is fixed.
            await orgAddMember(citizen.handle, mainOrg.id, mainOrg.rank.level, mainOrg.rank.title)

            if (org.founders && org.founders.find(item => item.handle === citizen.handle)) {
                await orgAddFounder(citizen.handle, mainOrg.id)
            }
        }
        if (citizen.orgs.affiliated.length > 0) {
            console.log("Adding affiliate org")
            for (const affOrg of citizen.orgs.affiliated) {
                const org = await getOrganization(affOrg.id, true)
                await orgAddAffiliate(citizen.handle, affOrg.id, affOrg.rank.level, affOrg.rank.title)
            }
        }
    }
    

    return citizen
}

export const removeCitizen = async (handle) => {
    logActivity('NEO4J', `Removing Citizen: ${handle}`)

    // remove citizen plus child nodes, if they exist.
    const query =
        `MATCH (c:Citizen)<--{0,1}(a)
         WHERE c.id =~ $handle
         DETACH DELETE c,a`

    const params = {
        handle: '(?i)' + handle
    }

    await writeQuery(query, params)
}

export const isVerified = async (handle) => {
    const query = 
        `MATCH (c:Citizen)
         WHERE c.id =~ $handle
         RETURN c as citizen`

         const params = {
            handle: '(?i)' + handle
         }

         const { result } = await readQuery(query, params)
         if (result[0]) {
            return result[0].citizen.verified
         }
         return false
         
}
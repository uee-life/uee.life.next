import { readQuery, writeQuery } from "./neo4j"
import { getOrganization, orgAddMember, orgAddFounder } from "./orgs"
import * as rsi from "./rsi"
import { parseStatus } from "./status"

export const getCitizen = async (handle, create = false, user = null) => {
    // try to load citizen from neo4j
    let citizen = await loadCitizen(handle)

    // if citizen isn't created yet, fetch the data from rsi and create it
    if(Object.keys(citizen).length === 0) {
        citizen = await rsi.fetchCitizen(handle)
        console.log('got citizen:', citizen)
        // added a check for random citizens without a record number. Not sure why they exist.
        if (citizen && citizen.record.startsWith("#") && create) {
            if(user && user.verified == 1) {
                citizen.verified = true
            } else {
                citizen.verified = false
            }
            logActivity('NEO4J', `Creating Citizen: ${citizen.handle}`, user ? user.handle : 'Anonymous')
            await createCitizen(citizen)
        }
    } else {
        //TODO: Transition this to using the graph, rather than polling RSI every time.
        citizen.orgs = await getCitizenOrgs(handle)
        // check and update verification
        if (user && user.verified == 1 && citizen.verified == false) {
            citizen.verified = true
            logActivity('NEO4J', `Updating Citizen: ${citizen.handle}`, user.handle)
            updateCitizen(citizen)
        } else if (user && user.verified == 0 && citizen.verified == true) {
            citizen.verified = false
            logActivity('NEO4J', `Updating Citizen: ${citizen.handle}`, user.handle)
            updateCitizen(citizen)
        }
    }

    return citizen
}

async function loadCitizen(handle) {
    console.log('loading citizen: ' + handle)
    const query = 
        `MATCH (c:Citizen)-[s:HAS_STATUS]->(:Status {type: 'active'})
         WHERE c.id =~ $handle
         return c as citizen, s.updated as status`
    const params = {
        handle: '(?i)' + handle
    }

    const {result, error} = await readQuery(query, params)

    if (error) {
        return null
    }

    let citizen = {}
    if(result[0]) {
        citizen = result[0].citizen
        citizen.status = parseStatus(result[0].status)
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
        handle: handle
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
        `MERGE (c:Citizen {
            handle: $handle,
            id: $id,
            name: $name,
            record: $record,
            enlisted: $enlisted,
            verified: $verified,
            portrait: $portrait,
            bio: $bio,
            website: $website
        })`

    const params = {
        handle: citizen.handle,
        id: citizen.handle,
        name: citizen.name,
        record: citizen.record,
        enlisted: citizen.enlisted,
        verified: citizen.verified,
        portrait: citizen.portrait,
        bio: citizen.bio,
        website: citizen.website
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
}

export const updateCitizen = async (citizen) => {
    const query = 
        `MATCH (c:Citizen {id: $handle})
         SET c += {
            name: $name,
            verified: $verified,
            bio: $bio,
            website: $website
         }
         return c`
    
    const params = {
        handle: citizen.handle,
        name: citizen.name,
        verified: citizen.verified,
        bio: citizen.bio,
        website: citizen.website
    }

    await writeQuery(query, params)
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
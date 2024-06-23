import { readQuery, writeQuery } from "./neo4j"
import { getOrganization, orgAddMember, orgAddFounder } from "./organization"
import * as rsi from "./rsi"

export const getCitizen = async (handle, create = false, user = null) => {

    // try to load citizen from neo4j
    let citizen = await loadCitizen(handle)

    // if citizen isn't created yet, fetch the data from rsi and create it
    if(Object.keys(citizen).length === 0) {
        citizen = await rsi.fetchCitizen(handle)

        if (citizen && create) {
            if(user && user.verified == 1) {
                citizen.verified = true
            } else {
                citizen.verified = false
            }
            await createCitizen(citizen)
        }
    } else {
        // check and update verification
        if (user && user.verified == 1 && citizen.verified == false) {
            citizen.verified = true
            updateCitizen(citizen)
        }
    }

    return citizen
}

async function loadCitizen(handle) {
    const query = "MATCH (citizen {handle: $handle}) return citizen"
    const {result, error} = await readQuery(query, {handle: handle})

    if (error) {
        return null
    }

    let citizen = {}
    if(result.length > 0) {
        citizen = result[0].citizen
    }

    return citizen
}

async function createCitizen(citizen) {
    console.log("Creating Citizen: ", citizen.handle)
    // first, save the actual citizen
    const query = 
        `MERGE (c:Citizen {
            handle: $handle,
            record: $record,
            name: $name,
            enlisted: $enlisted,
            verified: $verified,
            portrait: $portrait,
            bio: $bio
        })`

    const params = {
        handle: citizen.handle,
        record: citizen.record,
        name: citizen.name,
        enlisted: citizen.enlisted,
        verified: citizen.verified,
        portrait: citizen.portrait,
        bio: citizen.bio
    }
    await writeQuery(query, params)

    console.log(citizen)

    // then, if they are part of an org, see if the ORG already exists, if not, add that too
    if(citizen.orgs.main) {
        console.log("Found org, adding as member")
        const mainOrg = citizen.orgs.main
        const org = await getOrganization(mainOrg.tag, true)
        console.log(org)
        //FIXME: Fix the camelcase, and change this to org_rank when that part is fixed.
        await orgAddMember(citizen.handle, mainOrg.tag, mainOrg.rank.level, mainOrg.rank.title)

        if (org.founders && org.founders.find(item => item.handle === citizen.handle)) {
            await orgAddFounder(citizen.handle, mainOrg.tag)
        }
    }
}

export const updateCitizen = async (citizen) => {
    console.log("Updating Citizen: ", citizen.handle)
    const query = 
        `MATCH (c:Citizen {handle: $handle})
         SET c += {
            name: $name,
            verified: $verified,
            bio: $bio
         }
         return c`
    
    const params = {
        handle: citizen.handle,
        name: citizen.name,
        verified: citizen.verified,
        bio: citizen.bio
    }

    await writeQuery(query, params)
}
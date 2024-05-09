import { readQuery, writeQuery } from "./neo4j"
import { getOrganization } from "./organization"
import { fetchCitizen } from "./rsi"

export const getCitizen = async (user) => {
    // try to load citizen from neo4j
    console.log(user)
    let citizen = await loadCitizen(user)
    if(Object.keys(citizen).length === 0) {
        // if not found, grab from RSI data
        if(Object.keys(citizen).length === 0) {
            citizen = await fetchCitizen(user.handle)
        }
        citizen.verified = user.verified == 1
        console.log("Citizen: ", citizen)

        // if verified, store citizen information in neo4j
        await saveCitizen(citizen)
    }
    

    return citizen
}

async function loadCitizen(user) {
    const query = "MATCH (citizen {handle: $handle}) return citizen"
    const {result, error} = await readQuery(query, {handle: user.handle})
    console.log("loadCitizen: ", result)

    let citizen = {}
    if(result.length > 0) {
        citizen = result[0]._fields[0].properties
    }

    console.log(citizen)

    return citizen
}

async function saveCitizen(citizen) {
    console.log("Saving Citizen!")
    console.log(citizen)
    // first, save the actual citizen
    const query = 
        `MERGE (c:Citizen {
            handle: $handle,
            record: $record,
            name: $name,
            enlisted: $enlisted,
            verified: $verified
        })`

    const params = {
        handle: citizen.handle,
        record: citizen.record,
        name: citizen.name,
        enlisted: citizen.enlisted,
        verified: citizen.verified
    }
    await writeQuery(query, params)

    // then, if they are part of an org, see if the ORG already exists, if not, add that too
    if(citizen.org) {
        org = await getOrganization(citizen.org)
        //FIXME: Fix the camelcase, and change this to org_rank when that part is fixed.
        await joinOrganization(citizen.handle, citizen.org, citizen.orgTitle)
    }

}
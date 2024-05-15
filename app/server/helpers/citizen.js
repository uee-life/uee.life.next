import { readQuery, writeQuery } from "../utils/neo4j"
import { getOrganization, orgAddMember, orgAddFounder } from "./organization"
import * as rsi from "../utils/rsi"

export const getCitizen = async (user, create = false) => {

    // try to load citizen from neo4j
    let citizen = await loadCitizen(user.handle)

    // if citizen isn't created yet, fetch the data from rsi and create it
    if(Object.keys(citizen).length === 0) {
        citizen = await rsi.fetchCitizen(user.handle)

        if (citizen) {
            citizen.verified = user.verified == 1

            // if verified, store citizen information in neo4j
            if (create && user.verified) {
                await createCitizen(citizen)
            }
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
        citizen = result[0]._fields[0].properties
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
        const org = await getOrganization(citizen.org, true)
        //FIXME: Fix the camelcase, and change this to org_rank when that part is fixed.
        await orgAddMember(citizen.handle, citizen.org, citizen.orgTitle)

        if (org.founders.find(item => item.handle === citizen.handle)) {
            await orgAddFounder(citizen.handle, citizen.org)
        }
    }

}
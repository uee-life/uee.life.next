import { readQuery, writeQuery } from "./neo4j"
import { fetchOrg } from "./rsi"

export const getOrganization = async (tag) => {
    // try to load citizen from neo4j
    console.log(tag)
    let org = await loadOrganization(tag)
    // if not found, grab from RSI data
    if(Object.keys(org).length === 0) {
        org = await fetchOrg(tag)
    }

    console.log("Org: ", org)

    // if verified, store citizen information in neo4j
    await saveOrganization(org)

    return org
}

export const joinOrganization = async (handle, tag, rank) => {
    const query =
        `MATCH (c:Citizen {handle: $handle})
         MATCH (o:Organization {tag: $tag})
         MERGE (c)-[:MEMBER_OF {rank: $rank}]->[o]
         RETURN c`
    const params = {
        handle: handle,
        tag: tag,
        rank: rank
    }
    const error = await writeQuery(query, params)
}

async function loadOrganization(tag) {
    const query = "MATCH (o:Organization {tag: $tag}) return o"
    const {result, error} = await readQuery(query, {tag: tag})
    console.log("loadOrganization: ", result)

    let org = {}
    if(result.length > 0) {
        org = result[0]._fields[0].properties
    }

    console.log(org)

    return org
}

async function saveOrganization(org) {
    const query = 
        `MERGE (o:Organization {
            tag: $tag
        })`

    const params = {
        tag: org.tag
    }
    await writeQuery(query, params)
}
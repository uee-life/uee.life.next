import { readQuery, writeQuery } from "../utils/neo4j"
import * as rsi from "../utils/rsi"

export const getOrganization = async (tag, create = false) => {

    // try to load citizen from neo4j
    let org = await loadOrganization(tag)

    // if not found, grab from RSI data and create it
    if(org == null) {
        org = await rsi.fetchOrg(tag)
        if (create && Object.keys(org).length != 0) {
            await createOrganization(org)
        }
    }

    return org
}

async function loadOrganization(tag) {
    const query = "MATCH (o:Organization {tag: $tag}) return o"
    const {result, error} = await readQuery(query, {tag: tag})

    if (error) {
        return null
    }

    let org = null
    if(result.length > 0) {
        org = result[0]._fields[0].properties
    }

    return org
}

async function createOrganization(org) {
    const query = 
        `MERGE (o:Organization {
            tag: $tag,
            name: $name
        })`

    const params = {
        tag: org.tag,
        name: org.name
    }
    await writeQuery(query, params)
}

export const orgAddMember = async (handle, tag, rank) => {
    const query =
        `MATCH (c:Citizen {handle: $handle})
         MATCH (o:Organization {tag: $tag})
         MERGE (c)-[:MEMBER_OF {rank: $rank}]->(o)
         RETURN c`
    const params = {
        handle: handle,
        tag: tag,
        rank: rank
    }
    const error = await writeQuery(query, params)
}

export const orgAddFounder = async (handle, tag) => {
    const query =
        `MATCH (c:Citizen {handle: $handle})
         MATCH (o:Organization {tag: $tag})
         MERGE (c)-[:OWNER_OF]->(o)
         RETURN c`
    const params = {
        handle: handle,
        tag: tag
    }
    const error = await writeQuery(query, params)
}
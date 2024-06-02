import { readQuery, writeQuery } from "./neo4j"
import * as rsi from "./rsi"

export const getOrganization = async (tag, create = false) => {

    // try to load organization from neo4j
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

export const orgExists = async (tag) => {
    const org = await loadOrganization(tag)
    if (org != null) {
        return true
    }
    return false
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

export const createOrganization = async (org, official = false) => {
    const query = 
        `MERGE (o:Organization {
            tag: $tag,
            name: $name,
            type: $type,
            description: $description,
            official: $official
        })`

    const params = {
        tag: org.tag,
        name: org.name,
        type: org.model,
        description: org.description,
        official: official
    }
    await writeQuery(query, params)
}

export const orgAddMember = async (handle, tag, rank, title) => {
    const query =
        `MATCH (c:Citizen)
         WHERE c.handle =~ $handle
         MATCH (o:Organization {tag: $tag})
         MERGE (c)-[:MEMBER_OF {rank: $rank, title: $title}]->(o)
         RETURN c`
    const params = {
        handle: "(?i)"+handle,
        tag: tag,
        rank: rank,
        title: title
    }
    const error = await writeQuery(query, params)
}

export const orgAddFounder = async (handle, tag) => {
    const query =
        `MATCH (c:Citizen)
         WHERE c.handle =~ $handle
         MATCH (o:Organization {tag: $tag})
         MERGE (c)-[:OWNER_OF]->(o)
         RETURN c`
    const params = {
        handle: "(?i)"+handle,
        tag: tag
    }
    const error = await writeQuery(query, params)
}
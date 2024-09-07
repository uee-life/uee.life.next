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
    const query = "MATCH (o:Organization {tag: $tag}) return o as org"
    const {result, error} = await readQuery(query, {tag: tag})

    if (error) {
        return null
    }

    let org = null
    if(result.length > 0) {
        org = result[0].org
    }

    return org
}

export const createOrganization = async (org, official = false) => {
    const query = 
        `MERGE (o:Organization {
            tag: $tag,
            name: $name,
            type: $type,
            logo: $logo
            description: $description,
            official: $official
        })`

    const params = {
        tag: org.tag,
        name: org.name,
        type: org.model,
        logo: org.logo,
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
    // need to make sure the citizen is created first
    await getCitizen(handle, true)
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

export const getOrgMembers = async (tag, rank=0) => {
    const query = 
        `MATCH (c:Citizen)-[r:MEMBER_OF]->(o:Organization {tag: $tag})
         WHERE r.rank >= $rank
         RETURN c as member, r.rank as rank`
    const { result, error } = await readQuery(query, {tag: tag, rank: rank})

    const members = []

    for (const res of result) {
        const member = {
            name: res.member.name,
            handle: res.member.handle,
            rank: res.rank,
            portrait: res.member.portrait,
            verified: res.member.verified,
            status: await getStatus(res.member.handle)
        }
        members.push(member)
    }
    return members
}
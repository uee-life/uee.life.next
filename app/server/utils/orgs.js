import { readQuery, writeQuery } from "./neo4j"
import * as rsi from "./rsi"
import { parseStatus } from "./status"

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

async function loadOrganization(orgID) {
    const query = "MATCH (o:Organization {id: $orgID}) return o as org"
    const {result, error} = await readQuery(query, {orgID: orgID})

    if (error) {
        return null
    }

    let org = null
    if(result[0]) {
        org = result[0].org
    }

    return org
}

export const createOrganization = async (org, official = false) => {
    const query = 
        `MERGE (o:Organization {
            id: $id,
            name: $name,
            type: $type,
            logo: $logo,
            description: $description,
            official: $official
        })`

    const params = {
        id: org.id.toUpperCase(),
        name: org.name,
        type: org.model,
        logo: org.logo,
        description: org.description,
        official: official
    }
    await writeQuery(query, params)
}

export const orgAddMember = async (handle, orgID, rank, title) => {
    const query =
        `MATCH (c:Citizen)
         WHERE c.handle =~ $handle
         MATCH (o:Organization {id: $orgID})
         MERGE (c)-[:MEMBER_OF {rank: $rank, title: $title}]->(o)
         RETURN c`
    const params = {
        handle: "(?i)"+handle,
        orgID: orgID,
        rank: rank,
        title: title
    }
    const error = await writeQuery(query, params)
}

export const orgAddFounder = async (handle, orgID) => {
    // need to make sure the citizen is created first
    await getCitizen(handle, true)
    const query =
        `MATCH (c:Citizen)
         WHERE c.handle =~ $handle
         MATCH (o:Organization {id: $orgID})
         MERGE (c)-[:OWNER_OF]->(o)
         RETURN c`
    const params = {
        handle: "(?i)"+handle,
        orgID: orgID
    }
    const error = await writeQuery(query, params)
}

export const getOrgMembers = async (orgID, rank=0) => {
    const query = 
        `MATCH (:Status {type: 'active'})<-[s:HAS_STATUS]-(c:Citizen)-[r:MEMBER_OF]->(o:Organization {id: $orgID})
         WHERE r.rank >= $rank
         RETURN c as member, r.rank as rank, s.updated as status`
    const { result, error } = await readQuery(query, {orgID: orgID, rank: rank})

    const members = []

    for (const res of result) {
        const member = {
            name: res.member.name,
            handle: res.member.handle,
            rank: res.rank,
            portrait: res.member.portrait,
            verified: res.member.verified,
            status: parseStatus(res.status)
        }
        members.push(member)
    }

    return members
}
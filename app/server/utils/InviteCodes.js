export const generateCodes = async (count, type='standard', handle=null) => {
    const query = `
        UNWIND range(1, $count) as row
        MERGE (c:InviteCode {code: toUpper(right(left(randomUUID(), 13), 9)), used: false})
        set c = {
            code: toUpper(right(left(RandomUUID, 13), 9)),
            used: false,
            type: $type,
            issued: false            
        }
        return c as code
    `
    const result = await writeQuery(query, {
        count: parseInt(count),
        type: type
    })

    const citizen = await getCitizen(handle)

    if (type='buddy' && result[0] && result[0].code && citizen && citizen.verified) {
        await attachCode(result[0].code, citizen.id)
    }

    return result
}

const attachCode = async (code, citizenID) => {
    const query = `
        MATCH (c:Citizen)
        where c.id =~ $citizenID
        MATCH (i:InviteCode)
        WHERE i.code = $code
        MERGE (i)-[:BELONGS_TO]->(c)
    `
    await writeQuery(query, {
        id: '(?i)' + citizenID,
        code: code
    })
}

export const generateOrgCode = async (id) => {
    const org = await getOrganization(id, true)

    const query = `
        MERGE (c:InviteCode)-[:BELONGS_TO]->(o)
        SET c = {
            code: toUpper(right(left(RandomUUID(), 13), 9)),
            used: false,
            type: 'org',
            issued: false,
            org: $id
        }
        return c as code
    `

    const result = await writeQuery(query, {
        id: org.id
    })

    return result
}
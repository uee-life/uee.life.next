export const generateCodes = async (count, type='standard', handle=null) => {
    let owner = ''
    if (handle && type == 'buddy') {
        owner = handle
    }

    const query = `
        UNWIND range(1, $count) as row
        CREATE (c:InviteCode)
        set c = {
            code: toUpper(right(left(randomUUID(), 13), 9)),
            used: false,
            type: $type,
            issued: false,
            owner: $owner         
        }
        return c as code
    `
    const { result } = await writeQuery(query, {
        count: parseInt(count),
        type: type,
        owner: owner
    })

    const codes = []
    
    for (const res of result) {
        codes.push(res.code)
    }
    

    return codes
}


export const generateOrgCode = async (id) => {
    const org = await getOrganization(id, true)

    const query = `
        MERGE (c:InviteCode)-[:BELONGS_TO]->(o)
        SET c = {
            code: toUpper(right(left(randomUUID(), 13), 9)),
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

export const issueCodes = async () => {
    const query = `
        MATCH (c:InviteCode {type: 'standard'})
        SET c.issued = true
        return c
    `

    const { error } = writeQuery(query)
    return error
}
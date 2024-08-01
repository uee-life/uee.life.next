
export const onlineCount = async () => {
    const query = 
        `MATCH (c:Citizen)-[r:HAS_STATUS]->(s:Status)
            WHERE r.updated > datetime() - duration('PT30M')
            RETURN count(c) as count`
    const { result } = await readQuery(query)
    return result[0]
}

export const verifiedCount = async () => {
    const query = `
        MATCH (c:Citizen {verified: true})
        RETURN count(c) as count`
    const { result } = await readQuery(query)
    return result[0]
}

export const shipCount = async () => {
    const query = `
        MATCH (s:Ship)
        RETURN count(s) as count`
    const { result } = await readQuery(query)
    return result[0]
}
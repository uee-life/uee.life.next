// Public
export default defineEventHandler(async (event) => {
    return apiSuccess(await onlineCount())
})

const onlineCount = async () => {
    const query = 
        `MATCH (c:Citizen)-[r:HAS_STATUS]->(s:Status)
            WHERE r.updated > datetime() - duration('PT30M')
            RETURN count(c) as count`
    const { result } = await readQuery(query)
    return result[0]
}
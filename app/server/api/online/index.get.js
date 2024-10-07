// Public
export default defineEventHandler(async (event) => {
    return apiSuccess(await onlineUsers())
})

const onlineUsers = async () => {
    const query = 
        `MATCH (c:Citizen)-[r:HAS_STATUS]->(s:Status {type: 'active'})
            WHERE r.updated > datetime() - duration('PT30M')
            RETURN count(c) as count, c as online`
    const { result } = await readQuery(query)
    const online = []

    for (const res of result) {
        online.push(await getCitizen(res.online.handle))
    }
    return online
}
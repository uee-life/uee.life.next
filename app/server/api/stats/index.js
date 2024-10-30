// Public
export default defineEventHandler(async (event) => {
    const stats = {
        online: (await onlineCount()).count,
        verified: (await verifiedCount()).count,
        ships: (await shipCount()).count,
        fleets: (await fleetCount()).count,
        latest: await latestUser()
    }
    return apiSuccess(stats)
    //return await getStats()
})

const onlineCount = async () => {
    const query = 
        `MATCH (c:Citizen)-[r:HAS_STATUS]->(s:Status {type: 'active'})
            WHERE r.updated > datetime() - duration('PT30M')
            RETURN count(c) as count`
    const { result } = await readQuery(query)

    return result[0]
}
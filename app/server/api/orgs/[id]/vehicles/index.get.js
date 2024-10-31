// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    return apiSuccess(await getOrgShipList(id))
})

const getOrgShipList = async (id) => {
    console.log("Getting vehicles for org", id)
    const query =
        `MATCH (o:Organization)<-[:MEMBER_OF]-(c:Citizen)<-[:OWNED_BY]-(s:Vehicle)-[:INSTANCE_OF]->(m:VehicleModel)
         WHERE o.id =~ $id
         RETURN s as vehicle,
                m as vehicleData,
                c as owner`
    const result = await readQuery(query, {id: "(?i)"+id})
    const list = []
    for (const res of result.result) {
        const vehicle = {
            owner: res.owner,
            assignments: await getAssignments(res.vehicle.id, res.owner.id),
            ...res.vehicleData,
            ...res.vehicle,
        }

        list.push(vehicle)
    }
    return list
}
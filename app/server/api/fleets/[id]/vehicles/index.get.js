
export default defineEventHandler(async (event) => {
    const fleet = getRouterParam(event, 'id')

    return apiSuccess(await getShipList(fleet))
})

const getShipList = async (id) => {
    const query =
        `MATCH (s:Vehicle)-[:PART_OF]->(g:VehicleGroup)
         WHERE g.id =~ $id
         MATCH (o:Citizen)<-[:OWNED_BY]-(s)
         MATCH (s)-[:INSTANCE_OF]->(m:VehicleModel)
         RETURN s as vehicle,
                m as vehicleData,
                o as owner`
    const result = await readQuery(query, {id: "(?i)"+id})
    const vehicles = []
    for (const res of result.result) {
        const vehicle = {
            owner: res.owner,
            assignments: await getAssignments(res.vehicle.id, res.owner.id),
            ...res.vehicleData,
            ...res.vehicle
        }

        vehicles.push(vehicle)
    }
    return vehicles
}
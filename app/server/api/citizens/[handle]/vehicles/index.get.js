// Public
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    return apiSuccess(await getVehicleList(handle))
})

const getVehicleList = async (handle) => {
    const query =
        `MATCH (c:Citizen)<-[:OWNED_BY]-(s:Vehicle)-[:INSTANCE_OF]->(m:VehicleModel)
         WHERE c.handle =~ $handle
         RETURN s as vehicle,
                m as vehicleData,
                c as owner`
    const { result } = await readQuery(query, {handle: "(?i)"+handle})
    const vehicles = []
    for (const res of result) {
        const veh = {
            owner: res.owner,
            assignments: await getAssignments(res.vehicle.id, res.owner.id),
            ...res.vehicleData,
            ...res.vehicle
        }
        vehicles.push(veh)
    }
    return vehicles
}
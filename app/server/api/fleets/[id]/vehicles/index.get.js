import { getVehicleGroup } from "~/server/utils/vehicleGroups"

export default defineEventHandler(async (event) => {
    const groupID = getRouterParam(event, 'id')


    return apiSuccess(await getVehicleList(groupID))
})

const getVehicleList = async (id) => {
    const group = await getVehicleGroup(id)

    const vehicles = []

    if (group.org) {
        const query =
            `MATCH (s:Vehicle)-[:PART_OF]->(g:VehicleGroup)
            WHERE g.id =~ $id
            MATCH (o:Citizen)<-[:OWNED_BY]-(s)
            MATCH (s)-[:INSTANCE_OF]->(m:VehicleModel)
            RETURN s as vehicle,
                    m as vehicleData,
                    o as owner`
        const result = await readQuery(query, {id: "(?i)"+id})
        for (const res of result.result) {
            const vehicle = {
                owner: res.owner,
                assignments: await getAssignments(res.vehicle.id, group.org.id),
                ...res.vehicleData,
                ...res.vehicle
            }

            vehicles.push(vehicle)
        }
    }
    
    return vehicles
}
// Authenticated
// Authorized: Fleet admins
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    const group = await getVehicleGroup(data.groupID)

    if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
        const error = await addVehicle(data.vehicleID, group)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Vehicle Added!")
        }
    } else {
        return accessDenied(event)
    }
})

const addVehicle = async (vehicleID, group) => {
    // need to first add the vehicle to the vehicle group
    const addVehicle = 
        `MATCH (s:Vehicle {id: $vehicleID})-[:INSTANCE_OF]-(v:VehicleModel)
         MATCH (g:VehicleGroup {id: $groupID})
         MERGE (s)-[:PART_OF]->(g)
         return g.id as id,
                v as vehicle`

    // then we need to create a new crew assignment for that vehicle, owned by the org

    const { result, error } = await writeQuery(addVehicle, {
        vehicleID: vehicleID.toUpperCase(),
        groupID: group.info.id
    })

    if(result[0]) {
        console.log('vehicle added, creating crew assignment.', result[0].vehicle)
        const crewAssignment = await createAssignment(vehicleID, group.org.id, 'Crew', result[0].vehicle.max_crew)
        return result[0].id
    } else {
        return null
    }
}
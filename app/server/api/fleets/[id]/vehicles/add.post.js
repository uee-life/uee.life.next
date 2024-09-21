export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    if (user && user.verified) {
        const error = await addVehicle(data.vehicleID, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Vehicle Added!")
        }
    } else {
        return apiError(event, "You must be verified to add assignments.")
    }
})

const addVehicle = async (vehicleID, groupID) => {
    // need to first add the vehicle to the vehicle group
    const addVehicle = 
        `MATCH (s:Vehicle {id: $vehicleID})-[:INSTANCE_OF]-(v:VehicleModel)
         MATCH (g:VehicleGroup {id: $groupID})
         MERGE (s)-[:PART_OF]->(g)
         return g.id as id,
                v as vehicle`

    // then we need to create a new crew assignment for that vehicle, owned by the org
    const group = await getVehicleGroup(groupID)

    const { result, error } = await writeQuery(addVehicle, {
        vehicleID: vehicleID,
        groupID: groupID
    })

    if(result[0]) {
        console.log('vehicle added, creating crew assignment.', result[0].vehicle)
        const crewAssignment = await createAssignment(vehicleID, group.org.id, 'Crew', result[0].vehicle.max_crew)
        return result[0].id
    } else {
        return null
    }
}
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    if (user && user.verified) {
        const error = await removeVehicle(data.vehicleID, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Assignment Removed")
        }
    } else {
        return apiError(event, "You must be verified to add vehicles to this account.")
    }
})

const removeVehicle = async (vehicleID, groupID) => {
    // first, remove any org assignments to that vehicle
    const group = await getVehicleGroup(groupID)
    console.log(group)
    await clearAssignments(vehicleID, group.org.id)
    const query = 
        `MATCH (v:Vehicle {id: $vehicleID})-[r:PART_OF]->(g:VehicleGroup {id: $groupID})
         DELETE r`

    const params = {
        vehicleID: vehicleID,
        groupID: groupID
    }

    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    } else {
        return null
    }
}
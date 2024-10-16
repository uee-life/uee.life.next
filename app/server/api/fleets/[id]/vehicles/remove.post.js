// Authenticated
// Authorized: fleet group admin
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    const group = await getVehicleGroup(data.groupID)

    if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
        const error = await removeVehicle(data.vehicleID, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Assignment Removed")
        }
    } else {
        return accessDenied(event)
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
        vehicleID: vehicleID.toUpperCase(),
        groupID: groupID
    }

    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    } else {
        return null
    }
}
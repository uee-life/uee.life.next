// Authenticated
// Authorized: Vehicle Owner
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const vehicleID = getRouterParam(event, 'id')

    const data = await readBody(event)

    //TODO: make this implicit by passing the users handle
    const vehicle = await getVehicle(vehicleID)
    if (vehicle.owner.id == user.handle) {
        await updateVehicle(vehicleID, data.name)
        return apiSuccess("Vehicle updated!")
    } else {
        return accessDenied(event)
    }
})

const updateVehicle = async (id, name) => {
    const query = `
            MATCH (v:Vehicle)
            WHERE v.id =~ $id
            SET v.name = $name
        `
    
    const { error } = await writeQuery(query, {
        id: id,
        name: name
    })

    if (error) {
        return error
    }
    return null
}
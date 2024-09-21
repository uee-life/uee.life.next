export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const vehicleID = getRouterParam(event, 'id')
    console.log(vehicleID)
    const data = await readBody(event)

    const vehicle = await getVehicle(vehicleID)
    if (vehicle.owner.id == user.handle) {
        console.log('can update vehicle!')
        console.log(data)
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
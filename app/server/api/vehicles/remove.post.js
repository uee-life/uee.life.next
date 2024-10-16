// Authenticated
// Authorized: Vehicle Owner (implicit)
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const vehicle = await readBody(event)

    if (user && user.verified) {
        const error = await removeVehicle(vehicle, user.handle)
        if (error) {
            return apiError(event, `Error removing vehicle: ${error}`)
        } else {
            return apiSuccess('Vehicle Removed!')
        }
    }
    return apiError(event, 'Something went wrong in /api/vehicles/remove', 500)
})

const removeVehicle = async (ship, handle) => {
    await clearAllAssignments(ship.id)
    
    const query = 
        `MATCH (s:Vehicle {id: $id})-[:OWNED_BY]->(c:Citizen) 
        WHERE c.id =~ $handle
        DETACH DELETE s`
    
    const { error } = await writeQuery(query, {id: ship.id, handle: '(?i)'+handle})
    if (error) {
        return error
    }
    return null
}
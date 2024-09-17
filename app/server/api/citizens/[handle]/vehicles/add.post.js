export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const vehicle = await readBody(event)

    if (user && user.verified) {
        const error = await addVehicle(vehicle, user.handle)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Vehicle Added!")
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

const addVehicle = async (vehicle, handle) => {
    const query = 
        `MATCH (c:Citizen {handle: $handle})
         MATCH (m:VehicleModel {identifier: $id})
         MERGE (m)<-[:INSTANCE_OF]-(s:Vehicle {
            id: left(randomUUID(), 8),
            name: $name,
            registered: datetime()
        })-[:OWNED_BY]->(c)
        RETURN s.id as vehicle,
            m as model`

    const params = {
        handle: handle,
        id: vehicle.id,
        name: vehicle.name
    }
    const { error, result } = await writeQuery(query, params)

    if (result) {
        console.log('result')
        console.log(result[0].model)
        const crewAssignment = await createAssignment(result[0].vehicle, handle, 'Crew', result[0].model.max_crew)
        console.log(crewAssignment)
    }

    if (error) {
        return error
    }
    return null
}
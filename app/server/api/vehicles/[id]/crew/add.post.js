export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)

    const crewmate = await getCitizen(crew.handle, true)
    if (crewmate) {
        const error = await assignCrew(shipId, crew, user.handle)
        if (error) {
            console.error(error)
            return apiError(event, 400)
        } else {
            return apiSuccess("Crewmate added")
        }
    } else {
        return apiError(event, 400)
    }
})

// get the assignment for the vehicle
// if one doesn't exist, create one
// assign citizen to that assignment

// OR

// Create a crew manifest (assignment) in one call
// Assing people to that assignment

const assignCrew = async (ship, crew, owner) => {
    const query = 
        `MATCH (c:Citizen {handle: $handle})
         MATCH (s:Ship {id: $id})-[:OWNED_BY]->(Citizen {handle: $owner})
         MERGE (c)-[:CREW_OF {role: $role}]->(s)`

    const params = {
        id: ship,
        handle: crew.handle,
        owner: owner,
        role: crew.role
    }
    console.log(query, params)
    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    }
}
// Authenticated
// Authorized: Vehicle owner (implicit)
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)

    const crewmate = await getCitizen(crew.handle, true)
    if (crewmate) {
        const error = await assignCrew(shipId, crew, user.handle)
        if (error) {
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
        `MATCH (c:Citizen)
         WHERE c.id =~ $handle
         MATCH (s:Ship {id: $id})-[:OWNED_BY]->(o:Citizen)
         WHERE o.id =~ $owner
         with s as ship, c as crew
         MERGE (crew)-[:CREW_OF {role: $role}]->(ship)`

    const params = {
        id: ship,
        handle: '(?i)'+crew.handle,
        owner: '(?i)'+owner,
        role: crew.role
    }
    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    }
}
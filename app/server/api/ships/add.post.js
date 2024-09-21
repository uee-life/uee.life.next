

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const ship = await readBody(event)

    if (user && user.verified) {
        const error = await addShip(ship, user.handle)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Ship Added!")
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

export const addShip = async (ship, handle) => {
    const query = 
        `MATCH (c:Citizen {handle: $handle})
         MATCH (m:ShipModel {identifier: $id})
         MERGE (m)<-[:INSTANCE_OF]-(s:Ship {
            id: left(randomUUID(), 8),
            name: $name,
            registered: datetime()
        })-[:OWNED_BY]->(c)`

    const params = {
        handle: handle,
        id: ship.id,
        name: ship.name
    }
    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    }
    return null
}
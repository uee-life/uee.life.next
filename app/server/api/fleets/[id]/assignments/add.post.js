
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    if (user && user.verified) {
        const error = await addShip(data.shipID, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Ship Added!")
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

export const addShip = async (ship, group) => {
    const query = 
        `MATCH (s:Ship {id: $shipid})
         MATCH (g:VehicleGroup {id: $groupid})
         MERGE (s)-[:ASSIGNED_TO]->(a:Assignment {
            id: left(randomUUID(), 8),
            role: ''
         })-[:ATTACHED_TO]->(g)
         return g.id as id`

    const params = {
        shipid: ship,
        groupid: group
    }
    const { result, error } = await writeQuery(query, params)
    if (error) {
        return null
    } else {
        return result[0]._fields[0]
    }
}
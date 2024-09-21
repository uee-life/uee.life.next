
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const ship = await getShip(id)
    if (ship) {
        return apiSuccess(ship)
    } else {
        return apiError(event, 'Ship not found')
    }
    
})

export const getShip = async (identifier) => {
    // get ship instance
    const query =
        `MATCH (c:Citizen)<-[:OWNED_BY]-(s:Ship {id: $id})-[:INSTANCE_OF]->(m:ShipModel)
         RETURN c as owner,
                s as ship,
                m as info`
    const { result } = await readQuery(query, {id: identifier})
    // TODO: Check this actually returns a ship, else return an empty result.

    if (result) {
        const ship = {
            owner: result.owner,
            ...result.ship,
            ...result.info
        }
        return ship
    } else {
        return null
    }
}
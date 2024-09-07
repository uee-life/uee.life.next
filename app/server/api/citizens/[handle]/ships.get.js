
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    return apiSuccess(await getShipList(handle))
})

const getShipList = async (handle) => {
    const query =
        `MATCH (c:Citizen)<-[:OWNED_BY]-(s:Ship)-[:INSTANCE_OF]->(m:ShipModel)
         WHERE c.handle =~ $handle
         RETURN s as ship,
                m as shipData`
    const { result } = await readQuery(query, {handle: "(?i)"+handle})
    const ships = []
    for (const res of result) {
        const ship = {
            ...res.ship,
            ...res.shipData
        }
        //ship.data = res._fields[0].properties
        //ship.model = res._fields[1].properties
        ships.push(ship)
    }
    return ships
}
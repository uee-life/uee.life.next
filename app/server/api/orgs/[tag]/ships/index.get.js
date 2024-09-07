
export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')

    return apiSuccess(await getOrgShipList(tag))
})

const getOrgShipList = async (tag) => {
    console.log("Getting ships for org", tag)
    const query =
        `MATCH (o:Organization)<-[:MEMBER_OF]-(c:Citizen)<-[:OWNED_BY]-(s:Ship)-[:INSTANCE_OF]->(m:ShipModel)
         WHERE o.tag =~ $tag
         RETURN s as ship,
                m as shipData,
                c as owner`
    const result = await readQuery(query, {tag: "(?i)"+tag})
    const ships = []
    for (const res of result.result) {
        const ship = {
            owner: res.owner,
            ...res.ship,
            ...res.shipData
        }

        ships.push(ship)
    }
    return ships
}
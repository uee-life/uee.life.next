export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    return apiSuccess(await getAssignment(id))
})

const getAssignment = async (id) => {
    const query = `
        MATCH (a:Assignment)-[:ATTACHED_TO]->(g:VehicleGroup)
        WHERE a.id =~ $id
        MATCH (s:Ship)-[:ASSIGNED_TO]->(a)
        MATCH (o:Citizen)<-[:OWNED_BY]-(s)
        MATCH (s)-[:INSTANCE_OF]->(m:ShipModel)
        RETURN a as assignment,
                s as ship,
                m as shipData,
                o as owner,
                g as group`

    const { result } = await readQuery(query, {
        id: `(?i)${id}`
    })

    const assignments = []
    for (const res of result) {
        assignments.push({
            assignment: res.assignment,
            fleet: await getGroupFleet(res.group.id),
            group: res.group,
            ship: {
                owner: res.owner,
                ...res.ship,
                ...res.shipData
            }
        })
    }
    return assignments[0]
}

const getGroupFleet = async (id) => {
    console.log('getGroupFleet', id)
    const query = `
        MATCH (g:VehicleGroup {id: $id})-[:BELONGS_TO]->{0,10}(f:VehicleGroup)-[:BELONGS_TO]->(o:Organization)
        return f as fleet,
                o as org`

        const { result } = await readQuery(query, {
            id: id
        })
        if (result[0]) {
            const fleet = {
                org: result[0].org,
                info: result[0].fleet
            }
            return fleet
        }
        return {}
}

const getAssignedCrew = async (id) => {
    const query = `
        MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment)`
}

export default defineEventHandler(async (event) => {
    const fleet = getRouterParam(event, 'id')

    return apiSuccess(await getShipList(fleet))
})

const getShipList = async (id) => {
    const query =
        `MATCH (a:Assignment)-[:ATTACHED_TO]->(g:VehicleGroup)
         WHERE g.id =~ $id
         MATCH (s:Ship)-[:ASSIGNED_TO]->(a)
         MATCH (o:Citizen)<-[:OWNED_BY]-(s)
         MATCH (s)-[:INSTANCE_OF]->(m:ShipModel)
         RETURN a as assignment,
                s as ship,
                m as shipData,
                o as owner`
    const result = await readQuery(query, {id: "(?i)"+id})
    const assignments = []
    for (const res of result.result) {
        const assignment = {
            assignment: {
                attached_to: id,
                ...res.assignment,
            },
            owner: res.owner,
            ...res.ship,
            ...res.shipData
        }

        assignments.push(assignment)
    }
    return assignments
}

const getAssignmentCrew = async (id) => {

}
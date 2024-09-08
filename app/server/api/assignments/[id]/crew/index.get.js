export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, id)

    return apiSuccess(await getAssignedCrew(id))
})

const getAssignedCrew = async (id) => {
    const query = 
        `MATCH (a:Assignment)
        WHERE a.id =~ $id
        MATCH (c:Citizen)-[:ASSIGNED_TO]->(a)
        RETURN a as crew`
}
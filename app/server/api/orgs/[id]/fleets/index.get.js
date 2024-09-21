
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    return apiSuccess(await getFleetList(id))
})

const getFleetList = async (orgID) => {
    const query = `
        MATCH (g:VehicleGroup)-[:BELONGS_TO]->(o:Organization {id: $orgID})
        RETURN g as fleet`
    const { result, error } = await readQuery(query, { orgID: orgID })
    return result
}
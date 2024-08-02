
export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')

    return apiSuccess(await getFleetList(tag))
})

const getFleetList = async (tag) => {
    const query = `
        MATCH (g:VehicleGroup)-[:BELONGS_TO]->(o:Organization {tag: $tag})
        RETURN g as fleet`
    const { result, error } = await readQuery(query, { tag: tag })
    return result
}
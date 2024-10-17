// Public
export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const { result, error } =  await readQuery('MATCH (location:Location) RETURN location ORDER BY location.type DESC, location.name')
    const locations = []
    result.forEach(record => {
        locations.push(record.location)
    })
    return apiSuccess(locations)
})

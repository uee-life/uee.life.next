// Public
export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const { result, error } =  await readQuery('MATCH (system:System) RETURN system ORDER BY system.name')
    const systems = []
    result.forEach(record => {
        systems.push(record.system)
    })
    return apiSuccess(systems)
})

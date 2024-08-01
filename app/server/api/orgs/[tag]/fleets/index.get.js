
export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')

    return apiSuccess([])
})
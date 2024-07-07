
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    return apiSuccess(await getShipList(handle))
})

export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    return await getShipList(handle)
})
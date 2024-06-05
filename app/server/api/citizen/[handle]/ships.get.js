
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')
    // put in a graph load here
    //console.log(getCitizen(handle))
    return await getShipList(handle)
})
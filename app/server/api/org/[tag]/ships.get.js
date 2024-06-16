
export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    // put in a graph load here
    //console.log(getCitizen(handle))
    return await getOrgShipList(tag)
})
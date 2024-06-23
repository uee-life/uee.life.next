
export default defineEventHandler(async (event) => {
    if(await loggedIn(event)) {
        console.log('* logged in')
        const shipId = getRouterParam(event, 'id')
        const crew = await readBody(event)
        return removeCrew(shipId, crew.handle)
    } else {
        return apiError("Need to be logged in to manage ships")
    }
})
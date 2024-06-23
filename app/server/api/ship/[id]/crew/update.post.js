export default defineEventHandler(async (event) => {
    // change this to a granular permission check
    if(await loggedIn(event)) {
        const shipId = getRouterParam(event, 'id')
        const crew = await readBody(event)
        return updateCrew(shipId, crew)
    } else {
        return apiError("Not authroized to manage the crew of this ship")
    }
})
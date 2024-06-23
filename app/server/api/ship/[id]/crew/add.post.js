export default defineEventHandler(async (event) => {
    // change this to a granular permission check
    if(await loggedIn(event)) {
        const shipId = getRouterParam(event, 'id')
        const crew = await readBody(event)
        // check citizen exists in the DB, and create if it doesn't
        await getCitizen(crew.handle, true)
        return addCrew(shipId, crew)
    } else {
        return apiError("Not authroized to add crew to this ship")
    }
})
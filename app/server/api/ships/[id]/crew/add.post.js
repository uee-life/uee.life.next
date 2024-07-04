export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    // check citizen exists in the DB, and create if it doesn't
    await getCitizen(crew.handle, true)
    const error = await addCrew(shipId, crew)
    console.log(error)
    if (error) {
        console.error(error)
        return apiError(event, 400)
    } else {
        return apiSuccess(event, "Crewmate added")
    }
})
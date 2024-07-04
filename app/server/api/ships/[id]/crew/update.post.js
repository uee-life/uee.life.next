export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    // TODO: add authorization check
    const result = updateCrew(shipId, crew)
    if (error) {
        console.error(error)
        return apiError(event, 400, "Unable to udpate Crewmate")
    } else {
        return apiSuccess(event, "Crewmate updated")
    }
})
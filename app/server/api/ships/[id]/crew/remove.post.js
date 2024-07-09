
export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    //TODO: Add a check here to make sure you either own the ship, or you are the crewmember being removed.
    const error = await removeCrew(shipId, crew.handle)
    if (error) {
        console.error(error)
        return apiError(event, 400, "Unable to remove Crewmate")
    } else {
        return apiSuccess("Crewmate removed")
    }
})
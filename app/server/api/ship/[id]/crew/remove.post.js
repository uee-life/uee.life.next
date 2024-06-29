
export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    //TODO: Add a check here to make sure you either own the ship, or you are the crewmember being removed.
    return removeCrew(shipId, crew.handle)
})
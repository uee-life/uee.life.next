export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    // TODO: add authorization check
    return updateCrew(shipId, crew)
})
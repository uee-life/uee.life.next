export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    // check citizen exists in the DB, and create if it doesn't
    await getCitizen(crew.handle, true)
    return addCrew(shipId, crew)
})
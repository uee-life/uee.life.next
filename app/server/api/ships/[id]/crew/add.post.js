export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)

    const crewmate = await getCitizen(crew.handle, true)
    if (crewmate) {
        const error = await addCrew(shipId, crew, user.handle)
        if (error) {
            console.error(error)
            return apiError(event, 400)
        } else {
            return apiSuccess("Crewmate added")
        }
    } else {
        return apiError(event, 400)
    }
})
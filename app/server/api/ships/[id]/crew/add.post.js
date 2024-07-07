export default defineAuthenticatedEventHandler(async (event) => {
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)

    await getCitizen(crew.handle, true)
    const error = await addCrew(shipId, crew)
    console.log(error)
    if (error) {
        console.error(error)
        return apiError(event, 400)
    } else {
        return apiSuccess("Crewmate added")
    }
})
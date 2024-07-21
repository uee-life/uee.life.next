import { getShipOwner } from "~/server/utils/ships"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    
    // TODO: add authorization check
    const owner = await getShipOwner(shipId)
    if (user.handle == owner.handle) {
        const error = await updateCrew(shipId, crew)
        if (error) {
            console.error(error)
            return apiError(event, 400, "Unable to udpate Crewmate")
        } else {
            return apiSuccess("Crewmate updated")
        }
    } else {
        return accessDenied(event)
    }
})
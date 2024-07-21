import { getShipOwner } from "~/server/utils/ships"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const shipId = getRouterParam(event, 'id')
    const crew = await readBody(event)
    const owner = await getShipOwner(shipId)

    //TODO: Add a check here to make sure you either own the ship, or you are the crewmember being removed.
    if (user.handle == crew.handle || user.handle == owner.handle) {
        const error = await removeCrew(shipId, crew.handle)
        if (error) {
            console.error(error)
            return apiError(event, 400, "Unable to remove Crewmate")
        } else {
            return apiSuccess("Crewmate removed")
        }
    } else {
        return accessDenied(event)
    }
    
})
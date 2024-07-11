
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const ship = await getShip(id)
    if (ship) {
        return apiSuccess(ship)
    } else {
        return apiError(event, 'Ship not found')
    }
    
})


export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const ship = await getShip(id)
    console.log(ship)
    if (ship) {
        return apiSuccess(event, ship)
    } else {
        return apiError(event, 404, 'Ship not found')
    }
    
})

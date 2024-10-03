// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const vehicle = await getVehicle(id)

    if (vehicle) {
        return apiSuccess(vehicle)
    } else {
        return apiError(event, 'Vehicle not found')
    }
    
})
// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const fleet = await getVehicleGroup(id)
    if (fleet) {
        return apiSuccess(fleet)
    } else {
        return apiError(event, 'Fleet not found')
    }
    
})


export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const fleet = await getFleet(id)
    if (fleet) {
        return apiSuccess(fleet)
    } else {
        return apiError(event, 'Fleet not found')
    }
    
})
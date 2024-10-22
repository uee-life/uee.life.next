// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const fleet = await getOrgGroup(id)
    if (fleet) {
        return apiSuccess(fleet)
    } else {
        return apiError(event, 'Org not found')
    }
    
})

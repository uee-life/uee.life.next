// Public
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    let user = null
    if (event.context.user) {
        user = await loadUser(event.context.user)
    }
    
    const citizen = await getCitizen(handle, false, user)

    if (citizen) {
        return apiSuccess(citizen)
    } else {
        return apiError(event, "Citizen not found")
    }
})

export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')
    const citizen = await getCitizen(handle)

    if (citizen) {
        return apiSuccess(citizen)
    } else {
        return apiError(event, "Citizen not found")
    }
})
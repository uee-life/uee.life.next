
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')
    console.log('getting Citizen')
    const citizen = await getCitizen(handle)

    if (citizen) {
        return apiSuccess(citizen)
    } else {
        return apiError(event, "Citizen not found")
    }
})
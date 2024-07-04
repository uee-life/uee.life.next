
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')
    if (handle) {
        const citizen = await getCitizen(handle)
        console.log("Sending Citizen: ", citizen)
        return citizen
    } else {
        return apiError("Citizen not found")
    }
})
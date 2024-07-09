
export default defineCachedEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')
    const citizen = await getCitizen(handle)
    console.log('calling getCitizen')

    if (citizen) {
        return apiSuccess(citizen)
    } else {
        return apiError(event, "Citizen not found")
    }
}, {
    maxAge: 60 * 60,
    name: 'apiCitizenGet',
    swr: false,
    getKey: (event) => { return getRouterParam(event,'handle') }
})
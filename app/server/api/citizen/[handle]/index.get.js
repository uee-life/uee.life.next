import * as rsi from '~/server/utils/rsi'

export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')
    if (handle) {
        const citizen = await getCitizen(handle)
        return apiSuccess(citizen)
    } else {
        return apiError("Citizen not found")
    }
})
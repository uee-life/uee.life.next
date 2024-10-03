// Public
export default defineEventHandler(async (event) => {
    return apiSuccess(await randomUser())
})
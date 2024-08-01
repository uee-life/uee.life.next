
export default defineEventHandler(async (event) => {
    return apiSuccess(await onlineCount())
})


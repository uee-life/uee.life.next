// Public
export default defineEventHandler(async (event) => {
    const error = await issueCodes()
    if (error) {
        return apiError(event, error)
    }
    return apiSuccess('All codes issued!')
})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const crew = await getCrew(id)
    if (crew) {
        return apiSuccess(crew)
    } else {
        return apiError(event, "Crew not found")
    }
})
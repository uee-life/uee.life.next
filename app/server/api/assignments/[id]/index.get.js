export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    logger.debug('Getting assignment', id)

    const assignment = await getAssignment(id)
    if (assignment) {
        return apiSuccess(assignment)
    } else {
        return apiError(event, 'Assignment not found', 404)
    }
})
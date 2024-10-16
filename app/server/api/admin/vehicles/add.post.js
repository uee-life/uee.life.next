// Authenticated
// Authorized: [Admin:all]
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const model = await readBody(event)

    if (await checkPermission(user, ['admin:all'])) {
        const error = await addShipModel(model)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess('Ship Model Added!')
        }
    }

    return accessDenied(event)
})
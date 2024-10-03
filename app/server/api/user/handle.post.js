// Authenticated
// Authorized: Current user
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)

    if (user.handle == body.handle) {
        // nothing to do here
        return apiSuccess("Handles match, no change required!")
    } else {
        const account = await updateHandle(user.user_id, body.handle)
        if (account.app_metadata.handle == body.handle) {
            return apiSuccess(account)
        } else {
            return apiError("Couldn't change handle, something went wrong.")
        }
    }
})
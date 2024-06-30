import { updateHandle } from "~/server/utils/auth0"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)

    if (user.handle == body.handle) {
        // nothing to do here
        return apiSuccess(null, "Handles match, no change required!")
    } else {
        const account = await updateHandle(user.user_id, body.handle)
        console.log(account.app_metadata.handle, " > ", body.handle)
        if (account.app_metadata.handle == body.handle) {
            return apiSuccess(account, 'Handle successfully changed!')
        } else {
            return apiError("Couldn't change handle, something went wrong.")
        }
    }
})
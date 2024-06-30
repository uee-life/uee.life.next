import { getAccount } from "~/server/utils/auth0"


export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    return getAccount(user.user_id)
})
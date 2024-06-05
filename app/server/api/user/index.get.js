import { getCitizen } from "~/server/utils/citizen"
import { loadUser } from "~/server/utils/user"

export default defineEventHandler(async (event) => {
    let user = null
    if (event.context.user) {
        user = await loadUser(event.context.user)
    }

    if(user) {
        console.log('user found, getting citizen')
        console.log(user)
        user.info = await getCitizen(user, true)
    }
    return user
})
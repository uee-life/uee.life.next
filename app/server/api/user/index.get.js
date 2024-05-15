import { getCitizen } from "~/server/helpers/citizen"

export default defineEventHandler(async (event) => {
    let user = null
    if (event.context.user) {
        const existingUser = db.prepare("SELECT * FROM user WHERE id = ?").get(event.context.user.id)
        user = existingUser
    } else {
        user = event.context.user
    }
    console.log("user ", user)
    if(user) {
        console.log('user found, getting citizen')
        user.info = await getCitizen(user, true)
    }
    return user
})
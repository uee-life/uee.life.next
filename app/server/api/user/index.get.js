import { getCitizen } from "~/server/helpers/citizen"

export default defineEventHandler(async (event) => {
    let user = null
    if (event.context.user) {
        const existingUser = db.prepare("SELECT * FROM user WHERE id = ?").get(event.context.user.id)
        user = existingUser
    } else {
        user = event.context.user
    }
    if(user) {
        user.info = await getCitizen(user)
    }
    return user
})
import { getPermissions } from "./auth0"

export const loadUser = async (user) => {
    if (user && user.id) {
        const existingUser = db.prepare("SELECT * FROM user WHERE id = ?").get(user.id)
        return existingUser
    }
    return null
}
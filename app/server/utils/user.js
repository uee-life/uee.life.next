
export const loggedIn = async (event) => {
    const user = await loadUser(event.context.user)
    console.log("user", user)
    if(user) {
        return true
    }
    return false
}

export const loadUser = async (user) => {
    if (user && user.id) {
        const existingUser = db.prepare("SELECT * FROM user WHERE id = ?").get(user.id)
        return existingUser
    }
    return null
}
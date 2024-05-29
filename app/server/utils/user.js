

export const loadUser = async (user) => {
    const existingUser = db.prepare("SELECT * FROM user WHERE id = ?").get(user.id)
    return existingUser
}
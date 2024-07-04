

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const ship = await readBody(event)
    console.log(user)
    if (user && user.verified ) {
        const error = addShip(ship, user.handle)
        if (error) {
            return apiError("Something went wrong: ", error)
        } else {
            return apiSuccess(event, "Ship Added!")
        }
    } else {
        return apiError("You must be verified to add ships to this account.")
    }
})
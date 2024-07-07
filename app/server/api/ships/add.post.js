

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const ship = await readBody(event)

    if (user && user.verified) {
        const error = await addShip(ship, user.handle)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Ship Added!")
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})
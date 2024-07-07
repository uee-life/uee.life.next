

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const ship = await readBody(event)

    if (user && user.verified) {
        const error = await removeShip(ship, user.handle)
        if (error) {
            return apiError(event, `Error removing ship: ${error}`)
        } else {
            return apiSuccess('Ship Removed!')
        }
    }
    return apiError(event, 'Something went wrong in /api/ships/remove', 500)
})
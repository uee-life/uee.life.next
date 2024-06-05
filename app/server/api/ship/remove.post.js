

export default defineEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const ship = await readBody(event)

    if (user) {
        return removeShip(ship, user.handle)
    }
    return await getAllShipModels()
})
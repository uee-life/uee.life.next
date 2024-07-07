export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const status = await readBody(event)

    // do something
})
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const status = await getStatus(user.handle, 'active')

    // do something
    return apiSuccess(status)
})
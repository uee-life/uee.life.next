export default defineAuthenticatedEventHandler(async (event) => {
    let user = await loadUser(event.context.user)

    if(user) {
        console.log('user found, getting citizen')
        user.info = await getCitizen(user.handle, true, user)
    }
    return user
})
// Public
export default defineEventHandler(async (event) => {
    let user = await loadUser(event.context.user)
    console.log(user)

    if(user) {
        user.info = await getCitizen(user.handle, true, user) ?? {}
    }

    return apiSuccess(user)
})
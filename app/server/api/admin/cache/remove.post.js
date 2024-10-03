// Authenticated
// Authorized [admin:all]
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)

    if (await checkPermission(user, ['admin:all'])) {
        console.log(`[CACHE][${user.handle}] removing: ${body.item}`)
        await useStorage('cache').removeItem(body.item, true)
        return apiSuccess("Cache item removed!")
    }
    return accessDenied(event)
})

async function remove(item) {
    
}
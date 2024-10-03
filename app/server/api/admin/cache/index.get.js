// Authenticated
// Authorized [admin:all]
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    //TODO: do an admin authorization check here
    if (await checkPermission(user, ['admin:all'])) {
        const keys = await useStorage('cache').getKeys()
        const storage = {}
        for (const item of keys) {
            storage[item] = await useStorage('cache').getItem(item)
        }
        return storage
    } else {
        return accessDenied(event)
    }
})
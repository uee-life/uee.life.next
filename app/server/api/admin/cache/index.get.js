export default defineAuthenticatedEventHandler(async (event) => {
    //TODO: do an admin authorization check here
    const keys = await useStorage('cache').getKeys()
    const storage = {}
    for (const item of keys) {
        storage[item] = await useStorage('cache').getItem(item)
    }
    return storage
})
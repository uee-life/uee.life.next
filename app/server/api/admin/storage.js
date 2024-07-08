export default defineEventHandler(async (event) => {
    const storage = await useStorage('cache').getKeys()
    return storage
})
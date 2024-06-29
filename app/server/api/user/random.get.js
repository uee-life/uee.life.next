const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    return randomUser()
})
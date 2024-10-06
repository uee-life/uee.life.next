// Public
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    await checkAndCreateUser(body)
    return apiSuccess("Cache item removed!")
})

const checkAndCreateUser = async (data) => {
    // check invite code

    // create user account
    await createAccount('testuser', 'test@test.com', 'test12345')
}
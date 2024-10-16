// Public
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (await checkAndCreateUser(body)) {
        return apiSuccess("Account Created, check your email to finalize!")
    } else {
        return apiError(event, 'Unable to create account')
    }
    
})

const checkAndCreateUser = async (data) => {
    // check invite code
    console.log(data)
    if (checkCode(data.code))

    // create user account
    if (await createAccount(data.handle, data.email)) {
        return true
    } 
    return false
}

const checkCode = async (code) => {
    return true
}
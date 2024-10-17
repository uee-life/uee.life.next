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
    if (await checkCode(data.code)) {
        if (await createAccount(data.handle, data.email)) {
            return true
        } 
        return true
    }
    return false
    // create user account
}

const checkCode = async (code) => {
    const query = `
        MATCH (c:InviteCode)
        WHERE c.code = $code AND c.used = false
        SET c.used = true
        return c as code
    `
    const { result } = await writeQuery(query, {
        code: code.toUpperCase()
    })

    console.log(result)
    if (result[0]) {
        return true
    } else {
        return false
    }
}
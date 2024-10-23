// Public
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (await checkAndCreateUser(body)) {
        return apiSuccess("Account Created, check your email to finalize!")
    } else {
        return apiError(event, 'Code is not valid!')
    }
    
})

const checkAndCreateUser = async (data) => {
    // check invite code
    console.log(data)
    if (await checkCode(data.code, data.handle)) {
        if (await createAccount(data.handle, data.email)) {
            return true
        } 
        return true
    }
    return false
    // create user account
}

const checkOrgMember = async (org, handle) => {
    const citizen = getCitizen(handle)
    const mainOrg = citizen.orgs.main.id

    if (mainOrg == org) {
        return true
    } else {
        return false
    }
}

const checkCode = async (code, handle) => {
    if (code.length == 0) {
        return false
    }
    const query = `
        MATCH (c:InviteCode)
        WHERE c.code = $code AND c.used = false
        return c as code
    `
    const { result } = await writeQuery(query, {
        code: code.toUpperCase()
    })

    if (result[0]) {
        if (result[0].code.org) {
            if (checkOrgMember(result[0].code.org), handle) {
                logActivity('REGISTRATION', 'Org registration code used for org: ', result[0].code.org)
                return true
            } else {
                logActivity('REGISTRATION', 'Attempted code use by non-org member for org: ', result[0].code.org)
                return false
            }
        } else {
            const q = `
                MATCH (c:InviteCode)
                WHERE c.code = $code
                SET c.used = true
                return c
            `
            await writeQuery(query, {
                code: code.toUpperCase()
            })
        }
        return true
    } else {
        await addUsedCode(code.toUpperCase())
        return true
    }
}

const addUsedCode = async (code, handle) => {
    const query = `
        CREATE (c:InviteCode)
        SET c = {
            code: $code,
            used: true,
            type: 'standard',
            issued: true,
            owner: $handle
        }
    `

    await writeQuery(query, {
        code: code,
        handle: handle
    })
}
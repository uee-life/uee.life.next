const config = useRuntimeConfig()

const getToken = defineCachedFunction(async () => {
    const body = {
        'client_id': config.auth0_m2m.client_id,
        'client_secret': config.auth0_m2m.client_secret,
        'audience': config.auth0_m2m.audience,
        'grant_type': "client_credentials",
    }

    let token = ""

    await $fetch('https://ueelife.auth0.com/oauth/token', {
        method: 'post',
        headers: { 'content-type': 'application/json'},
        body: body,
        onRequest() {
            console.log(`[CACHE][getToken] Cache updated`)
        },
        onResponse({ request, response, options}) {
            console.log('got token: ', response._data)
            token = response._data.access_token
        }
    })

    return token
}, {
    maxAge: 60 * 60 * 23,
    name: 'auth0Token2',
    getKey: () => { return 'token'}
})

export const latestUser = async () => {
    const token = await getToken()
    const logs = await $fetch('https://ueelife.auth0.com/api/v2/logs', {
        method: 'get',
        headers: { 
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        query: {
            page: 0,
            per_page: 1,
            fields: 'details.response.body.app_metadata',
            q: 'type:"sapi" AND description:"Update a user"'
        },
        onResponse({ request, response, options}) {
            console.log(response._data)
            return response._data
        },
        onResponseError({request, response, options}) {
            console.log(response, request)
            return {}
        },
        onRequestError() {
            console.log("Error requesting")
            return {}
        }
    })
    return logs
}

export const randomUser = async () => {
    const token = await getToken()
    const user = await $fetch(`https://ueelife.auth0.com/api/v2/users`, {
        method: 'get',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        query: {
            q: 'app_metadata.handle_verified: true',
            per_page: 100
        }
    }).then((res) => {
        const i = Math.round(Math.random() * res.length)
        console.log("user: ", res[i])
        const user = {
            id: res[i].identities[0].user_id,
            handle: res[i].app_metadata.handle,
            verified: res[i].app_metadata.handle_verified,
            //email: res[i].email, // privacy
            visits: res[i].logins_count,
            last_visit: res[i].last_login
        }
        return user
    })
    return user
}

const addVerificationCode = async (userId) => {
    const code = crypto.randomUUID()
    console.log('generated uuid: ', code)
    updateAppMetadata(userId, {
        verificationCode: code
    })
    return code
}

export const verifyUser = async (userId, handle) => {
    // put in a check to make sure this handle hasn't already been verified.
    const token = await getToken()
    const existingUser = await $fetch(`https://ueelife.auth0.com/api/v2/users`, {
        method: 'get',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        query: {
            q: `app_metadata.handle:"${handle}" AND app_metadata.handle_verified: true`,
            per_page: 100
        }
    })
    console.log("Existing User: ")
    console.log(existingUser)
    if(existingUser[0]) {
        console.log('Handle already linked to an account')
        return null
    }
    // Update existing session
    db.prepare("UPDATE user SET verified=1 WHERE user_id = ?").run(userId)

    return await updateAppMetadata(userId, {
        handle_verified: true
    })
}

export const updateHandle = async (userId, handle) => {
    const account = await getAccount(userId)
    // delete old citizen record, plus anything directly linked to it, if a verified account existed.
    if (account.app_metadata.handle_verified) {
        await removeCitizen(account.app_metadata.handle)
    }

    // update existing session
    db.prepare("UPDATE user SET handle = ? WHERE user_id = ?").run(handle, userId)
    db.prepare("UPDATE user SET verified=0 WHERE user_id = ?").run(userId)

    // update metadata with new handle
    return await updateAppMetadata(userId, {
        handle: handle,
        handle_verified: false
    })
}

export const checkPermission = async (user, permissions) => {
    logActivity('AUTH', `Requesting Permissions ${permissions}`, user.handle)
    const perms = await getPermissions(user.user_id)
    return permissions.some(item => perms.includes(item))
}

export const getAccount = async (userId) => {
    const token = await getToken()
    const account = await $fetch(`https://ueelife.auth0.com/api/v2/users/${userId}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if(account.app_metadata.verificationCode) {
        return account
    } else {
        account.app_metadata.verificationCode = await addVerificationCode(account.user_id)
        console.log("account: ", account)
        return account
    }
}

export const getPermissions = async (userId) => {
    const token = await getToken()
    const permissions = await $fetch(`https://ueelife.auth0.com/api/v2/users/${userId}/permissions`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return permissions.map((item) => item.permission_name)
}



export const updateAppMetadata = async (userID, metadata) => {
    console.log("updating metadata:")
    console.log(metadata)
    const token = await getToken()
    const body = {
        app_metadata: metadata
    }
    const result = await $fetch(`https://ueelife.auth0.com/api/v2/users/${userID}`, {
        method: 'patch',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body
    })
    return result
}

export const createAccount = async (handle, email) => {
    console.log('creating account')
    const token = await getToken()
    console.info(token)
    const data = {
        email: email,
        user_metadata: {
            handle: handle
        },
        email_verified: false,
        connection: "Username-Password-Authentication",
        password: (Math.random() + 1).toString(36).substring(2) + 'aB!',
        verify_email: false,
        username: handle
    }

    console.log('creating account')

    const account = await $fetch(`https://ueelife.auth0.com/api/v2/users`, {
        method: 'post',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: data,
        onResponse({ response }) {
            console.info(response._data)
        }
    }).catch(err => {
        console.error(err)
    })

    console.log('getting reset token')

    // get password reset token
    const result = await $fetch(`https://ueelife.auth0.com/api/v2/tickets/password-change`, {
        method: 'post',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: {
            //result_url: 'www.uee.com/test',
            user_id: account.user_id,
            client_id: config.auth0_m2m.client_id,
            //organization_id: '',
            //connection_id: '',
            //email: account.email,
            ttl_sec: 0,
            mark_email_as_verified: false,
            includeEmailInRedirect: false
        },
        onResponse({request, response, error}) {
            console.log(response._data)
        }
    })

    console.log('Updating metadata')

    await updateAppMetadata(account.user_id, {
        reset_ticket: result.ticket
    })

    console.log('Sending verification email')

    // trigger a verification email
    const mailresult = await $fetch(`https://ueelife.auth0.com/api/v2/jobs/verification-email`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: {
            user_id: account.user_id,
            client_id: config.auth0_m2m.client_id,
        },
        onResponse({ response }) {
            console.log(response._data)
        }
     })

    console.log('email send result', result)
    return true
}

export class ManagementClient {
    constructor(
        domain,
        clientId,
        clientSecret,
        audience
    ) {
        this.domain = domain
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.audience = audience
    }
}

// export const manager = new ManagementClient({
//     domain: config.auth0.domain,
//     clientId: config.auth0.client_id,
//     clientSecret: config.auth0.client_secret,
//     scope: "read:users update:users read:logs",
//     audience: config.auth0.audience,
//     tokenProvider: {
//         enableCache: true,
//         cacheTTLInSeconds: 10
//     }
// })
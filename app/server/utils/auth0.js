const config = useRuntimeConfig()

const getToken = async () => {
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
        onResponse({ request, response, options}) {
            //console.log('got token: ', response._data)
            token = response._data.access_token
        }
    })

    return token
}

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

export const verifyUser = async (userId) => {
    return await updateAppMetadata(userId, {
        handle_verified: true
    })
}

export const updateHandle = async (userId, handle) => {
    const account = await getAccount(userId)
    // delete old citizen record, plus anything directly linked to it.
    removeCitizen(account.app_metadata.handle)

    // update metadata with new handle
    return await updateAppMetadata(userId, {
        handle: handle,
        handle_verified: false
    })
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
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

export const verifyUser = async (userId) => {
    return await updateUserMetadata(userId, {
        app_metadata: {
            handle_verified: true
        }
    })
}

export const getAccount = async (userId) => {
    const token = await getToken()
    const account = await $fetch(`https://ueelife.auth0.com/api/v2/users/${userId}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        onResponse(_ctx) {
            console.log(_ctx.response)
            console.log(_ctx.request)
        }
    })
    return account
}



export const updateUserMetadata = async (userID, metadata) => {
    const token = await getToken()
    await $fetch(`https://ueelife.auth0.com/api/v2/users/${userID}`, {
        method: 'patch',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: metadata
    })
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
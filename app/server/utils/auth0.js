const config = useRuntimeConfig()

const getToken = async () => {
    const body = {
        'client_id': config.auth0.client_id,
        'client_secret': config.auth0.client_secret,
        'audience': config.auth0.audience,
        'grant_type': "client_credentials",
    }

    let token = ""

    await $fetch('https://ueelife.auth0.com/oauth/token', {
        method: 'post',
        headers: { 'content-type': 'application/json'},
        body: body,
        onResponse({ request, response, options}) {
            token = response._data.access_token
        }
    })

    return token
}

const getLogs = async () => {
    const token = await getToken()
    let logs = {}
    await $fetch('https://ueelife.auth0.com/api/v2/logs', {
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
            logs = response._data
        },
        onResponseError({request, response, options}) {
            console.log(response, request)
        },
        onRequestError() {
            console.log("Error requesting")
        }
    })
    return logs
}

export const randomUser() {
    const token - await getToken()
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
        const user = {
            handle: res[i].app_metadata.handle,
            verified: res[i].app_metadata.handle_verified,
            email: res[i].email,
            visits: res[i].logins_count,
            last_visit: res[i].last_login
        }
        return user
    })
    return user
}

export const manager = async () => {
    const logs = await getLogs()
    console.log("LOGS: ", logs)
    return logs
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
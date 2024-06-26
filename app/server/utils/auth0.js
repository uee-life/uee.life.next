const config = useRuntimeConfig()

const getToken = async () => {
    const body = {
        'client_id': "6LP38EJnsEheWA4gM9R9bvV9fviITucH",
        'client_secret': "fd_A01Cb0SrupNTkntsFS60LO0rDoD0ae6iMEvFXmbvGVFpE7cvuNFFuue0-8MF5",
        'audience': "https://ueelife.auth0.com/api/v2/",
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
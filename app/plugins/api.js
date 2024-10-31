export default defineNuxtPlugin((nuxtApp) => {
    
    const api = $fetch.create({
        //baseURL: 'https://uee.life', //add baseurl here later?
        onRequest({ request, options, error }) {
            /* do something here to add headers/tokens or whatever */
        },
        onResponse({ response }) {
            const data = response._data
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                await nuxtApp.runWithContext(() => {
                const { $swal } = useNuxtApp()
                    $swal.fire({
                        title: "Unauthorized",
                        text: "Unauthorized - log in to access this feature",
                        icon: "error",
                        confirmButtonText: 'OK!'
                    }).then((result) => {
                        if(result.isConfirmed) {
                            reloadNuxtApp()
                        }
                    })
                })
            } else if (response.status == 500) {
                await nuxtApp.runWithContext(() => {
                    const { $swal } = useNuxtApp()

                    // TODO add some logging here?

                    $swal.fire({
                        title: "Server Error",
                        text: "Internal Server Error: " + `[${response._data.url}] ${response._data.message}`,
                        icon: "error",
                        confirmButtonText: 'OK!'
                    }).then((result) => {
                        if(result.isConfirmed) {
                            reloadNuxtApp()
                        }
                    })
                })
            } else {
                // 404 etc
            }
        }
    })

    return {
        provide: {
            api
        }
    }
})
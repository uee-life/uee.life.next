
export const searchCitizen = async (search) => {
    const result = await $fetch(`/api/search/citizen`, {
        method: 'POST',
        body: {
            text: search
        }
    })
    return result
}

export const getResponseData = (response) => {
    const data = handleResponse(response)
    return data.data
}

export const handleResponse = (response) => {
    const { $swal } = useNuxtApp()
    const alert = {}
    switch (response.status) {
        case 200:
            const apiResponse = response._data
            // add additional response processing here
            return apiResponse
            break
        case 401:
            // unauthorized
            alert.title = "Unauthorized"
            alert.text = "Unauthorized - log in to access this feature"
            alert.icon = "error"
            alert.next = reloadNuxtApp
            break
        default:
            alert.title = response.statusText
            alert.text = `${response.status} ${response.statusText} when accessing: ${response.url}`
            alert.icon = "error"
            alert.next = reloadNuxtApp
            break
    }

    if (alert.title) {
        $swal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.icon,
            confirmButtonText: 'OK!'
        }).then((result) => {
            if(result.isConfirmed) {
                alert.next()
            }
        })
    }
}
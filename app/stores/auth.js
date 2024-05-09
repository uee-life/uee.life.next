import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', () => {
    // state
    const user = ref(null)
    const citizen = ref(null)
    const isLoggedIn = ref(false)

    async function loadCitizen() {
        if (user.value) {
            console.log("loading citizen")
            url = `/api/citizen/${user.value.app_metadata.handle}`
            await useFetch(url, {
                key: 'loadCitizen',
                onResponse(_ctx) {
                    citizen.value = _ctx.response._data
                }
            })
        } else {
            citizen.value = null
        }
        
    }

    function $reset() {
        user.value = null
    }

    return { user, citizen, isLoggedIn, $reset, loadCitizen }
})
import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', () => {
    // state
    const user = ref({})
    const citizen = ref({})
    const isLoggedIn = ref(false)

    async function loadCitizen() {
        url = `/api/citizen/${user.value.app_metadata.handle}`
        await useFetch(url, {
            key: 'loadCitizen',
            onResponse(_ctx) {
                citizen.value = _ctx.response._data
            }
        })
    }

    function $reset() {
        user.value = ''
    }

    return { user, citizen, isLoggedIn, $reset, loadCitizen }
})
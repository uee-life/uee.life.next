import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', () => {
    const { $api } = useNuxtApp()
    // state
    const user = ref(null)
    const loading = ref(true)

    const isAuthenticated = computed({
        get() {
            return user.value != null
        }
    })

    const citizen = computed({
        get() {
            if (user.value == null) {
                return null
            }
            return user.value.info
        }
    })

    async function loadUser() {
        const res = await $api(`/api/user`, {
            onResponseError({ response }) {
                // ignore this, we just aren't logged in.
                return null
            }
        })
        if (res.status == 'success') {
            user.value = res.data
        }
    }

    async function initApp() {
        await loadUser()
        loading.value = false
    }

    function $reset() {
        user.value = null
        isAuthenticated.value = false
    }

    return { user, citizen, isAuthenticated, loading, loadUser, initApp, $reset }
})
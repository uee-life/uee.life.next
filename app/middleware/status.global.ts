export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useAuthStore()
    const { $api } = useNuxtApp()
    if (auth.isAuthenticated) {
        await $api(`/api/user/status`, {
            method: "POST",
            body: {
                location: to.fullPath
            },
            onResponseError({ response }) {
                if (response.status == 401) {
                    // session logged out on server. reload the app to fix the desync
                    reloadNuxtApp()
                }
            }
        })
    }
});
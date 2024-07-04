export default defineNuxtRouteMiddleware(async () => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return navigateTo("/");
});
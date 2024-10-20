export default defineNuxtRouteMiddleware(async (to, from) => {
    const protectedPaths = ['/admin', '/settings']
    if(!!protectedPaths.find((item) => to.path.startsWith(item))) {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return navigateTo("/");
    }
});
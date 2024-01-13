export default defineNuxtRouteMiddleware((to, from) => {
    const isLoggedIn = true

    if (isLoggedIn) {
        console.log("logged in to ", to.fullPath)
        //return navigateTo(to.fullPath)
    }

    //return navigateTo("/login")
})
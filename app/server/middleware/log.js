export default defineEventHandler(async (event) => {
    let user = {handle: "Anonymous"}
    if(event.context.user) {
        user = await loadUser(event.context.user)
    }
    const path = getRequestURL(event)
    if (path.pathname.startsWith('/api/')) {
        console.log('[API REQUEST]' + `[${user.handle}] ` + path)
    } else {
        console.log('[WEB REQUEST]' + `[${user.handle}] ` + path)
    }
})
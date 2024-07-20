export default defineEventHandler(async (event) => {
    let user = {handle: "Anonymous"}
    if(event.context.user) {
        user = await loadUser(event.context.user)
    }
    const path = getRequestURL(event)
    if (path.pathname.startsWith('/api/')) {
        logActivity('API-CALL', path, user.handle)
    } else {
        logActivity('WEB-CALL', path, user.handle)
    }
})
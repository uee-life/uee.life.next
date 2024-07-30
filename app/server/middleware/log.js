export default defineEventHandler(async (event) => {
    let user = {handle: "Anonymous"}
    const path = getRequestURL(event)
    if(event.context.user) {
        // set active status for logged in users
        user = await loadUser(event.context.user)
        await setStatus(user.handle, 'active')
    }
    if (path.pathname.startsWith('/api/')) {
        logActivity('API-CALL', path, user.handle)
    } else {
        logActivity('WEB-CALL', path, user.handle)
    }
})
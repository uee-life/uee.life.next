export default defineEventHandler((event) => {
    let user = "Anonymous"
    if(event.context.user) {
        user = event.context.user.id
    }
    console.log('[API REQUEST]' + `[${user}]` + getRequestURL(event))
})
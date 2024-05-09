export default eventHandler(async (event) => {
    if (!event.context.session) {
        return sendRedirect(event, "/")
    }
    await lucia.invalidateSession(event.context.session.id)
    appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize())
    return sendRedirect(event, "/")
})
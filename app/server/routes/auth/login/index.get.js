import { generateState } from "arctic"

export default defineEventHandler(async (event) => {
    const state = generateState()
    const url = await auth0.createAuthorizationURL(state, {
        scopes: ["profile", "email"]
    })

    const returnPath = new URL(getHeader(event, 'referer')).pathname

    setCookie(event, "auth0_return_path", returnPath, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 60 * 10,
        sameSite: "lax"
    })

    setCookie(event, "auth0_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    })

    return sendRedirect(event, url.toString())
})
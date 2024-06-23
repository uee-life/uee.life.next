import { generateState } from "arctic"

export default defineEventHandler(async (event) => {
    const state = generateState()
    const url = await auth0.createAuthorizationURL(state, {
        scopes: ["profile", "email"]
    })

    console.log(getHeader(event, 'referer'))

    const returnPath = new URL(getHeader(event, 'referer')).pathname
    console.log('returning to: ', returnPath)

    setCookie(event, "auth0_return_path", returnPath, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
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
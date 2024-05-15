import { OAuth2RequestError } from "arctic";
import { DatabaseUser, generateId } from "lucia";

export default defineEventHandler(async (event) => {
    console.log('in auth/callback');
    const query = getQuery(event);
    const code = query.code?.toString() ?? null;
    const state = query.state?.toString() ?? null;
    const error = query.error?.toString() ?? null;
    const error_description = query.error_description?.toString() ?? null;
    const storedState = getCookie(event, "auth0_oauth_state") ?? null;

    const result = {
        status: "",
        message: ""
    }

    if (error) {
        return {
            status: "error",
            message: error_description
        }
        // do an auth0 logout here
    }

    if (!code || !state || !storedState || state !== storedState) {
        /*throw createError({
            status: 400
        });*/
        return {
            status: "error",
            message: "Missing data (code or state mismatch)"
        }
    }

    try {
        const tokens = await auth0.validateAuthorizationCode(code);

        const auth0UserResponse = await fetch("https://ueelife.auth0.com/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const resp = await auth0UserResponse.json()
        console.log("auth response: " + resp)
        resp.handle = resp['https://uee.life/app_metadata'].handle
        resp.verified = resp['https://uee.life/app_metadata'].handle_verified
        const auth0user: Auth0User = resp;

        const existingUser = db.prepare("SELECT * FROM user WHERE handle = ?").get(auth0user.handle) as
                | DatabaseUser
                | undefined;
        
        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {});
            appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
            return {
                status: "success"
            }
            //return sendRedirect(event, "/");
        }

        const userId = generateId(15);
        db.prepare("INSERT INTO user (id, handle, verified) VALUES (?, ?, ?)").run(
            userId,
            auth0user.handle,
            (auth0user.verified ? 1 : 0)
        );
        const session = await lucia.createSession(userId, {});
        appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
        return {
            status: "success"
        }
        //return sendRedirect(event, "/");
    } catch (e) {
        if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
            return {
                status: "error",
                message: e.message
            }
            throw createError({
                status: 400
            });
        }
        return {
            status: "error",
            message: "Unknown server error occurred"
        }
        throw createError({
            status: 500
        });
    }
});

interface Auth0User {
    sub: string;
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    'https://uee.life/user_metadata': object;
    'https://uee.life/app_metadata': object;
    handle: string;
    verified: boolean;
}
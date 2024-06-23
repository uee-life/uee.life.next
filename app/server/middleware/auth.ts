import { verifyRequestOrigin } from "lucia";

import type {Session, User} from "lucia";


export default defineEventHandler(async (event) => {
    if (event.method !== "GET") {
        const originHeader = getHeader(event, "Origin") ?? null;
        const hostHeader = getHeader(event, "x-forwarded-host") ?? getHeader(event, "host") ?? null;
        if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
            return event.node.res.writeHead(403).end();
        }
    }

    const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
    if (!sessionId) {
        event.context.session = null;
        event.context.user = null;
        if (event.method !== "GET") {
            return event.node.res.writeHead(401).end();
        }
        return;
    }

    const {session, user} = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        appendResponseHeader(
            event,
            "Set-Cookie",
            lucia.createSessionCookie(session.id).serialize()
        )
    }
    if (!session) {
        appendResponseHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize())
    }
    event.context.session = session;
    event.context.user = user;
    if (event.method !== "GET" && !user) {
        return event.node.res.writeHead(401).end();
    }

    console.log('USER: ', user)
})

declare module "h3" {
    interface H3EventContext {
        user: User | null;
        session: Session | null;
    }
}
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./db";
import { Auth0 } from "arctic";

import type { DatabaseUser } from "./db";

import { webcrypto } from "crypto";
globalThis.crypto = webcrypto as Crypto;

const adapter = new BetterSqlite3Adapter(db, {
    user: "user",
    session: "session"
});

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !import.meta.dev
        }
    },
    //TODO: may need something else here...
    /*getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
            githubId: attributes.github_id
        }
    }*/
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<DatabaseUser, "id">;
    }
}

const config = useRuntimeConfig();

export const auth0 = new Auth0(config.auth0.domain, config.auth0.client_id, config.auth0.client_secret, config.auth0.redirect_uri)
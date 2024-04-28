import { createAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(createAuth0, {
        domain: "ueelife.auth0.com",
        clientId: "zuzjutKxacFWZ65JljEJiD99ogBHIe5J",
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    })
})
// https://nuxt.com/docs/api/configuration/nuxt-config
//import { resolve } from "path"
const config = require('./config.json')

export default defineNuxtConfig({
  devtools: { enabled: true },

  alias: {
    assets: "/<rootDir>/assets",
  },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/main.scss'
  ],

  googleFonts: {
    families: {
      Michroma: true
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    'nuxt-viewport'
  ],

  plugins: [
    //'~/plugins/db.js',
    //{ src: '~/plugins/vue-good-table', ssr: false }
  ],

  routeRules: {
    // redirect, ssr, cors, headers, static/swr
    //'/myroute/**': {ssr: true},
  },

  runtimeConfig: {
    host_uri: "http://localhost:3000",
    auth0: {
      domain: config.AUTH0_DOMAIN,
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      audience: config.AUTH0_AUDIENCE,
      redirect_uri: "http://localhost:3000/auth/signed-in",
    }
  }
})

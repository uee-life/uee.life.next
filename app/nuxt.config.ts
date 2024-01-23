// https://nuxt.com/docs/api/configuration/nuxt-config
//import { resolve } from "path"

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
    { src: '~/plugins/vue-good-table', ssr: false }
  ],

  routeRules: {
    // redirect, ssr, cors, headers, static/swr
    //'/myroute/**': {ssr: true},
  }
})

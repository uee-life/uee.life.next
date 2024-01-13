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

  modules: [
    '@pinia/nuxt',
  ]
})

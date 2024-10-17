// https://nuxt.com/docs/api/configuration/nuxt-config
//import { resolve } from "path"
const config = require('./config.json')

export default defineNuxtConfig({
 devtools: { enabled: true },

 alias: {
   assets: "/<rootDir>/assets",
 },

 app: {
     head: {
       title: 'UEE.life',
       meta: [
         { charset: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1' },
         { hid: 'description', name: 'description', content: 'The Portal to your life in the UEE' },
         { name: 'og:title', property: 'og:title', content: 'UEE.life' },
         { name: 'og:description', property: 'og:description', content: 'The Portal to your life in the UEE' },
         { name: 'og:image', property: 'og:image', content: 'https://uee.life/images/uee.life.jpg' },
         { name: 'og:url', property: 'og:url', content: 'https://uee.life' },
         { name: 'twitter:image', property: 'twitter:image', content: 'https://uee.life/images/uee.life.jpg' },
         { name: 'twitter:card', property: 'twitter:card', content: 'https://uee.life/images/uee.life.jpg' },
       ],
       link: [
/*         { rel: 'icon', type: 'image/x-icon', href: 'https://uee.life/favicon.ico' },
         { rel: 'stylesheet', type: 'text/css', href: '//fonts.googleapis.com/css?family=Electrolize|Orbitron:400,500,700|Share+Tech+Mono'},
         { rel: 'stylesheet', type: 'text/css', href: '//fonts.googleapis.com/css?family=Michroma&display=swap'},
         { rel: 'stylesheet', type: 'text/scss', href: 'sweetalert2/src/sweetalert2.scss'}*/
       ]
     },
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
   '@pinia-plugin-persistedstate/nuxt',
   '@nuxt/content',
   '@nuxtjs/google-fonts',
   '@nuxtjs/device',
   'nuxt-viewport',
   '@nuxt-alt/google-analytics'
 ],

 gAnalytics: {
   measurementId: "G-SH1PW5J3QJ"
 },

 plugins: [
   //'~/plugins/db.js',
   //{ src: '~/plugins/vue-good-table', ssr: false }
 ],

 routeRules: {
   // redirect, ssr, cors, headers, static/swr
   //'/myroute/**': {ssr: true},
   '/api/**': { cors: true },
   '/admin/**': { ssr: false }
 },

 runtimeConfig: {
   public: config.public,
   
   auth0: config.auth0,

   auth0_m2m: config.auth0_m2m,

   external: config.external
 },

 compatibilityDate: '2024-08-17'
})
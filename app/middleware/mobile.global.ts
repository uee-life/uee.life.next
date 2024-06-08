/*export default function (ctx) {
    let userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent
    ctx.isMobile = /mobile/i.test(userAgent)
    ctx.store.commit('SET_MOBILE', ctx.isMobile) 
    console.log('Is mobile', ctx.isMobile)
  }*/

//import { mainStore } from "@/stores/mainStore.js"

export default defineNuxtRouteMiddleware((ctx) => {
  //const store = mainStore()
  console.log('firing mobile check middleware')
  //console.log(store.isMobile)
})
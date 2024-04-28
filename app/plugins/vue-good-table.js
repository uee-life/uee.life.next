import VueGoodTablePlugin from 'vue-good-table'

import 'vue-good-table/dist/vue-good-table.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueGoodTablePlugin)
})
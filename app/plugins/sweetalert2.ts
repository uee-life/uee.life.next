import Swal from "sweetalert2";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('$swal', Swal)
})
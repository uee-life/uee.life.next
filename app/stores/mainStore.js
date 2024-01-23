import { defineStore } from "pinia"

export const mainStore = defineStore('main', () => {
    // state
    const isMobile = ref(false)
    const isTablet = ref(false)

    function setMobile() {
        isMobile.value = true
    }

    function setTablet() {
        isTablet.value = true
    }

    return { isMobile, setMobile }
})
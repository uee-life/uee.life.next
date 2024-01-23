import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', () => {
    // state
    const user = ref('Capn_Flint')

    return { user }
})
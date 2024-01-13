import { defineStore } from "pinia"

export const mainStore = defineStore('main', () => {
    // state
    const test = ref('testing')

    // computed getter
    const updatedTest = computed(() => test.value = "getter test")

    // action
    function testAction() {
        test.value = 'actoin test'
    }

    return { test, testAction }
})
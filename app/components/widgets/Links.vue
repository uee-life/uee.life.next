<template>
        <div v-for="link in links" :key="link.url" class="left-nav-button">
            <a :href="link.url" target="_blank">{{link.name}}</a>
        </div>
</template>

<script setup>
const props = defineProps({
    links: {
        type: Array
    }
})
</script>

<style scoped>
</style>
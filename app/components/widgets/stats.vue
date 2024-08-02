<script setup>

const stats = ref({
    verified: 0,
    online: 0,
    ships: 0,
    fleets: 0
})
const verified = ref(0)
const online = ref(0)
const ships = ref(0)
const fleets = ref(0)

const { data, status, refresh } = await useAPI(`/api/stats`, {
    onResponse({ response }) {
        stats.value = response._data.data
    }
})
const update = setInterval(() => {
    refresh()
}, 60000);

onBeforeUnmount(() => {
    clearInterval(update)
})
</script>

<template>
    <div class="stats">
        <span>Verified Users: {{ stats.verified }}</span>
        <span>Online Now: {{ stats.online }}</span>
        <span>Ships: {{ stats.ships }}</span>
        <span>Fleets: {{ stats.fleets }}</span>
    </div>
</template>

<style scoped>
.stats {
    display: flex;
    flex-direction: column;
}
</style>
<script setup>

const verified = ref(0)
const online = ref(0)
const ships = ref(0)

const { data: stats, status, refresh } = await useAPI(`/api/stats`, {
    onResponse({ response }) {
        verified.value = response._data.data.verified.count
        online.value = response._data.data.online.count
        ships.value = response._data.data.ships.count
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
        <span>Verified Users: {{ verified }}</span>
        <span>Online Now: {{ online }}</span>
        <span>Ships: {{ ships }}</span>
    </div>
</template>

<style scoped>
.stats {
    display: flex;
    flex-direction: column;
}
</style>
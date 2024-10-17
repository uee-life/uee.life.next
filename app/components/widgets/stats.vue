<script setup>

const stats = ref({
    verified: 0,
    online: 0,
    ships: 0,
    fleets: 0,
    latest: null
})
const verified = ref(0)
const online = ref(0)
const ships = ref(0)
const fleets = ref(0)
const latest = ref(null)

const { data, status, refresh } = useAPI(`/api/stats`, {
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
    <template v-if="stats.latest">
        <div class="stats">
            <span>Verified Users: {{ stats.verified }}</span>
            <span>Online Now: {{ stats.online }}</span>
            <span>Ships: {{ stats.ships }}</span>
            <span>Fleets: {{ stats.fleets }}</span>
        </div>
        <hr class="spacer"/>
        <div class="latest">
            <h3>Latest Citizen</h3>
            <citizen-portrait :citizen="stats.latest" :show-name="true" />
        </div>
    </template>
    <widgets-loading v-else />
</template>

<style scoped>
.stats {
    display: flex;
    flex-direction: column;
}

.latest {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}
</style>
<script setup>
import { isAfter, formatDistance } from 'date-fns'

const online = ref([])

const last_seen = (last) => {
    const seen = formatDistance(new Date(last), new Date())
    if (seen.startsWith('less')) {
        return `Online`
    } else {
        return `Seen ${seen} ago`
    }
    
} 

function sortItems(items) {
    return items.sort((a, b) => (isAfter(new Date(a.status.last), new Date(b.status.last))) ? -1 : 1)
}

const update = setInterval(() => {
    refresh()
}, 60000);

onBeforeUnmount(() => {
    clearInterval(update)
})

const { data, status, refresh } = useAPI(`/api/online`, {
    onResponse({ response }) {
        online.value = sortItems(response._data.data)
    }
})

</script>

<template>
    <div class="online-list">
        <div class="online-item" v-for="citizen of online" @click="navigateTo(`/citizens/${citizen.handle}`)">
            <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
            <span><div class="name">{{ citizen.name }}</div><div class="seen">{{ last_seen(citizen.status.last) }}</div></span>
        </div>
    </div>
</template>

<style scoped>
.online-list {
    display: flex;
    flex-direction: column;
    cursor: pointer;
}

.online-item {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.online-item>span {
    margin: 5px;
}

.online-item>.status>img {
    width: 18px;
    margin-top: 8px;
}

.name {
    font-size: 12px;
    font-weight: bold;
}

.seen {
    font-size: 11px;
    font-style: italic;
}
</style>
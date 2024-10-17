<script setup>
import { isAfter, formatDistance } from 'date-fns'

const online = ref({
    org: {
        name: '',
        citizens: []
    }
})
const count = ref(0)

const last_seen = (last) => {
    if (last) {
        const seen = formatDistance(new Date(last), new Date())
        if (seen.startsWith('less')) {
            return `Online`
        } else {
            return `Seen ${seen} ago`
        }
    } else {
        return 'Never seen'
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
        console.log(response._data.data.org)
        online.value.org.name = response._data.data.org.name.name
        online.value.org.citizens = sortItems(response._data.data.org.citizens)
    }
})

</script>

<template>
    <div class="online-list">
        <div class="collapsible">- Friends ---------------</div>
        <div class="online-item" v-if="online.friends" v-for="citizen of online.friends" @click="navigateTo(`/citizens/${citizen.handle}`)">
            <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
            <span><div class="name">{{  citizen.name  }}</div><div class="seen">{{  last_seen(citizen.status.last) }}</div></span>
        </div>
        <div class="online-item"><i>No friends online</i></div>
        <div class="collapsible">- {{ online.org.name }} ----</div>
        <div class="online-item" v-for="citizen of online.org.citizens" @click="navigateTo(`/citizens/${citizen.handle}`)">
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
    max-height: 350px;
    overflow: scroll;
    font-size: 13px;
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
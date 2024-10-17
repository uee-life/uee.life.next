<script setup>
import { isAfter, formatDistance } from 'date-fns'

const online = ref([])
const count = ref(0)

const last_seen = (last) => {
    const seen = formatDistance(new Date(last), new Date())
    if (seen.startsWith('less')) {
        return `Online`
    } else {
        return `Seen ${seen} ago`
    }
    
}

const confirmFriend = async (citizen) => {
    console.log('confirming friend:', citizen)
}

function sortItems(items) {
    return items.sort((a, b) => (a.status.last == '' || isAfter(new Date(a.status.last), new Date(b.status.last))) ? -1 : 1)
}

const update = setInterval(() => {
    refresh()
}, 60000);

onBeforeUnmount(() => {
    clearInterval(update)
})

const { data, status, refresh } = useAPI(`/api/friends`, {
    onResponse({ response }) {
        console.log(response._data.data)
        online.value = sortItems(response._data.data)
    }
})

</script>

<template>
    <div class="online-list">
        <div  v-if="online" v-for="citizen of online">
            <div class="online-item" v-if="citizen.friendship == 'confirmed'" @click="navigateTo(`/citizens/${citizen.handle}`)">
                <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
                <span><div class="name">{{  citizen.name  }}</div><div v-if="citizen.status" class="seen">{{  last_seen(citizen.status.last) }}</div></span>
            </div>
            <div v-else-if="citizen.friendship == 'received'" class="online-item">
                <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
                <span><div class="name">{{  citizen.name  }}</div><div v-if="citizen.status" class="seen">Incoming Request</div></span>
                <div class="confirm">
                    <img class="button" src="@/assets/tick.png" @click="confirmFriend(citizen)">
                    <img class="button" src="@/assets/delete.png"  @click="">
                </div>
            </div>
            <div v-else-if="citizen.friendship == 'requested'" class="online-item">
                <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
                <span><div class="name">{{  citizen.name  }}</div><div v-if="citizen.status" class="seen">Request Sent</div></span>
            </div>
        </div>
        <div v-else class="online-item"><i>No friends online</i></div>
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
    margin: 5px 5px 0 0;
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

.confirm {
    position: absolute;
    right: 15px;
    display: flex;
    width: 50px;
    align-items: center;
}

.confirm>.button {
    margin: 2px;
    width: 25px;
    cursor: pointer;
}
</style>
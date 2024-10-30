<script setup>
const { $api } = useNuxtApp()

import { isAfter, formatDistance } from 'date-fns'

const online = ref([])
const count = ref(0)
const friend = ref(null)

const modals = ref({
    friend_confirm: false
})

const last_seen = (last) => {
    const seen = formatDistance(new Date(last), new Date())
    if (seen.startsWith('less')) {
        return `Online`
    } else {
        return `Seen ${seen} ago`
    }
    
}

const confirmFriend = async () => {
    modals.value.friend_confirm = false
    console.log('confirming friend:', friend.value)
    await $api(`/api/friends/confirm`, {
        method: 'POST',
        body: {
            friend: friend.value
        }
    })
    refresh()
}

const cancelFriend = async () => {
    modals.value.friend_confirm = false
    console.log('cancelling friend:', friend.value)
    await $api(`/api/friends/cancel`, {
        method: 'POST',
        body: {
            friend: friend.value
        }
    })
    refresh()
}

const selectFriend = (fr) => {
    friend.value = fr.handle
    modals.value.friend_confirm = true
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
        <div v-if="online.length == 0" class="online-item"><i>No friends online</i></div>
        <div  v-else v-for="citizen of online">
            <div class="online-item" v-if="citizen.friendship == 'confirmed'" @click="navigateTo(`/citizens/${citizen.handle}`)">
                <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
                <span><div class="name">{{  citizen.name  }}</div><div v-if="citizen.status" class="seen">{{  last_seen(citizen.status.last) }}</div></span>
            </div>
            <div v-else-if="citizen.friendship == 'received'" class="online-item" @click="selectFriend(citizen)">
                <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
                <span><div class="name">{{  citizen.name  }}</div><div v-if="citizen.status" class="seen">Incoming Request</div></span>
            </div>
            <div v-else-if="citizen.friendship == 'requested'" class="online-item">
                <span><citizen-portrait :citizen="citizen" shape="round" size="tiny"/></span>
                <span><div class="name">{{  citizen.name  }}</div><div v-if="citizen.status" class="seen">Request Sent</div></span>
            </div>
        </div>
        <modal-confirm v-if="modals.friend_confirm" text="Accept Friend Request?" @confirm="confirmFriend" @cancel="cancelFriend"></modal-confirm>
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
    right: 45px;
    display: flex;
    width: 50px;
    align-items: center;
    z-index: 100;
}

.confirm>.button {
    margin: 2px;
    height: 40px;
    cursor: pointer;
    color: #dbf3ff;
    background: rgba(13, 46, 66, 0.8);
    text-transform: uppercase;
}
</style>
<template>
<client-only>
    <div class='citizen'>
    <teleport to="#left-dock">
        <panel-dock title="Navigation" class="left-nav">
            <div class="left-nav-button"><router-link to="/citizens">Search Citizens</router-link></div>
            <div class="left-nav-button"><a :href="dossierLink" target="_blank">Official Dossier</a></div>
        </panel-dock>
        <!--panel-dock v-if="citizen && citizen.links.length > 0" title="Citizen links">
            <div v-for="link in citizen.links" :key="link.url" class="link">
                <div class="left-nav-button"><a :href="link.url" target="_blank">{{link.text}}</a></div>
            </div>
        </panel-dock-->
    </teleport>
    <teleport to="#right-dock">
        <!--citizen-tools v-if="isOwner" @syncSuccess="refresh" />
        <citizen-org v-if="citizen.org" :citizen="citizen"/-->
    </teleport>

    <div v-if="pending" class="loading">
        <img src="@/assets/loading.gif" >
    </div>
    <template v-else-if="citizen.info">
        <citizen-info :isOwner="isOwner" :citizen="citizen.info" @refresh="refresh" />
        <citizen-bio :bio="citizen.info.bio"/>
        <div class="citizen-tabs">
            <layout-tabs :tabs="tabs" :initialTab="initialTab">
                <template #tab-title-ships>
                    SHIPS ({{ citizen.ships.length }})
                </template>
                <template #tab-content-ships>
                    <fleet-view :isOwner="isOwner" :ships="citizen.ships" @add="addShip" @remove="removeShip"/>
                </template>

                <template v-if="isOwner" #tab-title-location>
                    LOCATION
                </template>
                <template v-if="isOwner" #tab-content-location>
                    <citizen-location :citizen="citizen"/>
                </template>
            </layout-tabs>
        </div>
    </template>
    <template v-else>
        <h3>Citizen Not Found...</h3>
    </template>
  </div>
</client-only>
</template>

<script setup>

const route = useRoute()
const tabs = ref(['ships', 'location'])
const initialTab = ref('ships')
const citizen = ref({
    info: {
        handle: '',
        bio: ''
    },
    home: {},
    ships: [],
    org: null,
    links: []
})
const showModal = ref(true)

// temp vars
const loading = ref(false)
const isOwner = ref(true)

const pending = ref(true)

function dossierLink() {
    return `https://robertsspaceindustries.com/citizens/${route.params.handle}`
}

function edit() {

}

function save() {

}

async function addShip(ship) {

}

async function removeShip(ship) {

}

async function getShips() {

}

async function getOrg() {

}

function refresh() {

}

async function getCitizen() {
    pending.value = true
    console.log('fetching citizen data')
    const { data: citizen } = await useFetch('/api/citizen/rsiData?handle=' + route.params.handle, {
        key: 'getCitizen',
        server: false,
        lazy: true,
        onResponse(_ctx) {
            console.log("response")
        }
    })
    //console.log(citizen)
    //citizen.value.info = info
    //pending.value = false
}

const { data: info } = await useFetch('/api/citizen/rsiData?handle=' + route.params.handle, {
        key: 'getCitizen',
        server: false,
        lazy: true,
        onResponse(_ctx) {
            console.log("context:", _ctx.response._data)
            console.log("response:", info.value)
            citizen.value.info = info
            pending.value = false
        }
})

onMounted(() => {
    //getCitizen()
})

//citizen.value.info = info
//console.log(citizen.value.ships)
</script>

<style>
.citizen.content {
    margin-top: 20px;
}

.citizen-tabs {
    margin-top: 20px;
}
</style>
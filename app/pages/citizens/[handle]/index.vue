<template>
<client-only>
    <div class='citizen'>
    <teleport to="#left-dock">
        <panel-dock title="Navigation" class="left-nav">
            <div class="left-nav-button"><router-link to="/citizens">Search Citizens</router-link></div>
            <div class="left-nav-button"><a :href="dossierLink" target="_blank">Official Dossier</a></div>
        </panel-dock>
        <panel-dock v-if="citizen && citizen.links.length > 0" title="Citizen links">
            <div v-for="link in citizen.links" :key="link.url" class="link">
                <div class="left-nav-button"><a :href="link.url" target="_blank">{{link.text}}</a></div>
            </div>
        </panel-dock>
    </teleport>
    <teleport to="#right-dock">
        <!--citizen-tools v-if="isOwner" @syncSuccess="refresh" /-->
        <citizen-org v-if="found && citizen.info.orgRank" :citizen="citizen"/>
    </teleport>

    <div v-if="pending" class="loading">
        <img src="@/assets/loading.gif" >
    </div>
    <template v-else-if="found">
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
    <widgets-no-result v-else />
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
const found = ref(false)

const dossierLink = computed({
    get() {
        return `https://robertsspaceindustries.com/citizens/${route.params.handle}`
    }
})

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

async function getOrg(tag) {
    pending.value = true
    await useFetch(`/api/org/${tag}`, {
        onResponse(_ctx) {
            citizen.value.org = _ctx.response._data
            pending.value = false
        }
    })
}

function refresh() {

}


await useFetch(`/api/citizen/${route.params.handle}`, {
        key: 'getCitizen',
        server: false,
        lazy: true,
        async onResponse(_ctx) {
            citizen.value.info = _ctx.response._data
            if(citizen.value.info.org) {
                await getOrg(citizen.value.info.org)
            }
            if(citizen.value.info.website) {
                citizen.value.links.push({text: 'Website', url: citizen.value.info.website})
            }
            found.value = true
            pending.value = false
        },
        onResponseError(_ctx) {
            found.value = false
        }
})
</script>

<style>
.citizen.content {
    margin-top: 20px;
}

.citizen-tabs {
    margin-top: 20px;
}

.no-results {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .no-results>.text {
        position: relative;
        width: fit-content;
        padding-left: 20px;
        padding-right: 20px;
        margin: 20px;
    }

    .no-results>.text.big {
        font-family: 'Michroma';
        font-size: 25px;
    }
</style>
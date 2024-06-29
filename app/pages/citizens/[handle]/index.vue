<template>
    <div class='citizen'>
        <div v-if="pending" class="loading">
            <img src="@/assets/loading.gif" >
        </div>
        <template v-else-if="citizen.handle">
            <client-only>
                <teleport to="#left-dock">
                    <panel-dock title="Navigation" class="left-nav">
                        <div class="left-nav-button"><router-link to="/citizens">Search Citizens</router-link></div>
                        <div class="left-nav-button"><a :href="dossierLink" target="_blank">Official Dossier</a></div>
                    </panel-dock>
                    <panel-dock v-if="citizen && links.length > 0" title="Citizen links">
                        <div v-for="link in links" :key="link.url" class="link">
                            <div class="left-nav-button"><a :href="link.url" target="_blank">{{linkDomain(link.url)}}</a></div>
                        </div>
                    </panel-dock>
                    <panel-dock v-if="isOwner" title="Tools">
                        <div class="left-nav-button" @click="sync"><a @click.stop="sync">Sync Profile</a></div>
                    </panel-dock>
                </teleport>
                <teleport to="#right-dock">
                    <citizen-org v-if="citizen.orgs && citizen.orgs.main" :org="citizen.orgs.main"/>
                    <!--citizen-org v-if="citizen.info.orgs && citizen.info.orgs.affiliated" v-for="org in citizen.info.orgs.affiliated" :org="org" :affiliate="true"/-->
                </teleport>
            </client-only>
            <citizen-info :isOwner="isOwner" :citizen="citizen" @refresh="refresh" />
            <citizen-bio :bio="citizen.bio"/>
            <div class="citizen-tabs">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template #tab-title-ships>
                        SHIPS ({{ ships.length }})
                    </template>
                    <template #tab-content-ships>
                        <fleet-view v-if="ships" :isOwner="isOwner" :ships="ships" @add="addShip" @remove="removeShip"/>
                    </template>

                    <template v-if="isOwner" #tab-title-location>
                        LOCATION
                    </template>
                    <template v-if="isOwner" #tab-content-location>
                        <citizen-location :isOwner="isOwner" :citizen="citizen"/>
                    </template>
                </layout-tabs>
            </div>
        </template>
        <widgets-no-result text="Citizen Not Found" v-else />
    </div>
</template>

<script setup>
const {$swal} = useNuxtApp()

const route = useRoute()
const tabs = ref(['ships', 'location'])
const initialTab = ref('ships')

const ships = ref([])
const links = ref([])

const isOwner = computed({
    get() {
        const user = useUser()
        return user.value != undefined 
            && citizen.value.handle == user.value.handle 
            && user.value.verified == 1
    }
})

function linkDomain(link) {
    const url = new URL(link)
    return url.hostname
}

const dossierLink = computed({
    get() {
        return `https://robertsspaceindustries.com/citizens/${route.params.handle}`
    }
})

async function sync() {
    console.log('Syncing...')
    await $fetch('/api/user/sync', {
        key: 'syncCitizen',
        onResponse(_ctx) {
            console.log('Sync done!')
            const result = _ctx.response._data
            console.log(result)
            $swal.fire({
                title: result.status,
                text: result.message,
                icon: 'success',
                confirmButtonText: 'OK!'
            })
        },
        onResponseError(_ctx) {
            console.error('Sync Error', _ctx.response._data)
        }
    })
}

async function addShip(ship) {
    await $fetch('/api/ship/add', {
        key: 'addShip',
        method: 'POST',
        body: ship,
        onResponse(_ctx) {
            $swal.fire({
                title: "Added",
                text: "Ship successfully added",
                icon: 'success',
                confirmButtonText: 'OK!'
            })
        },
        onResponseError(_ctx) {
            console.error('Add Error: ', _ctx.response._data)
        }
    })
    await refresh()
}

async function removeShip(ship) {
    await $fetch('/api/ship/remove', {
        key: 'removeShip',
        method: 'POST',
        body: ship,
        onResponse(_ctx) {
            $swal.fire({
                title: "Removed",
                text: "Ship successfully removed",
                icon: 'success',
                confirmButtonText: 'OK!'
            })
        },
        onResponseError(_ctx) {
            console.error('Remove error: ', _ctx.response._data)
        }
    })
    await refresh()
}

async function getShips() {
    await $fetch(`/api/citizen/${route.params.handle}/ships`, {
        key: 'getShips',
        async onResponse(_ctx) {
            ships.value = _ctx.response._data
        }
    })
}

const { data: citizen, refresh, pending } = await useFetch(`/api/citizen/${route.params.handle}`, {
        key: 'getCitizen',
        server: false,
        lazy: true,
        async onResponse({ response }) {
            const data = response._data
            console.log("getCitizen: ", data)
            //citizen.value.info = data
            if(data.website) {
                links.value.push({text: 'Website', url: data.website})
            }
            await getShips()
        },
        onResponseError(_ctx) {
            parseResponseCode(_ctx.response)
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
</style>
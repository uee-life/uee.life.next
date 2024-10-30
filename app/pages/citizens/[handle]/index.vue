<script setup>
const {$swal, $api, $viewport} = useNuxtApp()

const auth = useAuthStore()

const route = useRoute()
const tabs = ref(['vehicles', 'location'])
const initialTab = ref('vehicles')

const vehicles = ref([])
const links = ref([])

const modals = ref({
    vehicle: false,
    friend_confirm: false
})

const isOwner = computed({
    get() {
        return auth.isAuthenticated
            && citizen.value.data.handle == auth.citizen.handle 
            && auth.user.verified == 1
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
    await $api('/api/user/sync', {
        key: 'syncCitizen',
        onResponse({ response }) {
            const result = response._data
            $swal.fire({
                title: result.status,
                text: result.message,
                icon: 'success',
                confirmButtonText: 'OK!'
            })
        }
    })
}

async function addVehicle(vehicle) {
    modals.value.vehicle = false

    await $api(`/api/citizens/${route.params.handle}/vehicles/add`, {
        key: 'addVehicle',
        method: 'POST',
        body: vehicle,
        onResponse({ response }) {
            if (response._data.status == 'success') {
                $swal.fire({
                    title: "Added",
                    text: "Vehicle successfully added",
                    icon: 'success',
                    confirmButtonText: 'OK!'
                })
            } else {
                $swal.fire({
                    title: "Error",
                    text: "Unable to add vehicle",
                    icon: 'error',
                    confirmButtonText: 'OK!'
                })
            }
        }
    })
    await refresh()
}

async function removeVehicle(vehicle) {
    await $api('/api/vehicles/remove', {
        key: 'citizenRemoveVehicle',
        method: 'POST',
        body: vehicle,
        onResponse({ response }) {
            if (response._data.status == 'success') {
                $swal.fire({
                    title: "Removed",
                    text: "Vehicle successfully removed",
                    icon: 'success',
                    confirmButtonText: 'OK!'
                })
            } else {
                $swal.fire({
                    title: "Error",
                    text: "Unable to remove vehicle",
                    icon: 'error',
                    confirmButtonText: 'OK!'
                })
            }
        }
    })
    await refresh()
}

async function getVehicles() {
    await $api(`/api/citizens/${route.params.handle}/vehicles`, {
        onResponse({ response }) {
            vehicles.value = response._data.data
        }
    })
}

const requestFriend = async () => {
    await $api(`/api/friends/request`, {
        key: 'requestFriend',
        method: 'POST',
        body: {
            friend: route.params.handle
        }
    })
    refresh()
}

const confirmFriend = async () => {
    modals.value.friend_confirm = false
    await $api(`/api/friends/confirm`, {
        method: 'POST',
        body: {
            friend: route.params.handle
        }
    })
}

const cancelFriend = async () => {
    modals.value.friend_confirm = false
}

const { data: citizen, refresh, status } = useAPI(`/api/citizens/${route.params.handle}`, {
        key: 'getCitizen',
        server: false,
        lazy: true,
        async onResponse({ response }) {
            const data = response._data.data
            if(data.website) {
                links.value.push({text: 'Website', url: data.website})
            }
            await getVehicles()
        }
})
</script>

<template>
    <div class='citizen'>
        <widgets-loading v-if="status != 'success'" />
        <template v-else-if="citizen.status == 'success'">
            <client-only>
                <teleport to="#left-dock">
                    <panel-dock v-if="citizen.data.orgs.main.id && $viewport.isGreaterOrEquals('tablet')" :title="citizen.data.orgs.main.model ? citizen.data.orgs.main.mode : 'Organization'">
                        <citizen-org v-if="citizen.data.orgs && citizen.data.orgs.main" :org="citizen.data.orgs.main"/>
                    </panel-dock>
                    <panel-dock title="Navigation" class="left-nav">
                        <div class="left-nav-button"><router-link to="/citizens">Search Citizens</router-link></div>
                        <div class="left-nav-button"><a :href="dossierLink" target="_blank">Official Dossier</a></div>
                    </panel-dock>
                    <panel-dock v-if="citizen && links.length > 0" title="Citizen links">
                        <div v-for="link in links" :key="link.url" class="link">
                            <div class="left-nav-button"><a :href="link.url" target="_blank">{{linkDomain(link.url)}}</a></div>
                        </div>
                    </panel-dock>
                    <panel-dock v-if="isOwner && $viewport.isGreaterOrEquals('tablet')" title="Tools">
                        <div class="left-nav-button" @click="sync"><a @click.stop="sync">Sync Profile</a></div>
                    </panel-dock>
                    <panel-dock v-if="isOwner" title="Friends" >
                        <widgets-friends/>
                    </panel-dock>
                    
                    <panel-dock v-if="auth.isAuthenticated && !isOwner" title="Add Friend">
                        <div v-if="citizen.data.friendship == null" class="add-friend interact" @click="requestFriend">Send friend request</div>
                        <div v-else-if="citizen.data.friendship == 'confirmed'" class="add-friend">You are friends!</div>
                        <div v-else-if="citizen.data.friendship == 'requested'" class="add-friend">Request Sent!</div>
                        <div v-else-if="citizen.data.friendship == 'received'" class="add-friend interact" @click="modals.friend_confirm = true">Accept Request</div>
                    </panel-dock>

                    <widgets-buddy-codes v-if="auth.isAuthenticated && isOwner" />
                </teleport>
                <teleport to="#right-dock">
                    <panel-dock v-if="isOwner && $viewport.isLessThan('tablet')" title="Tools">
                        <div class="left-nav-button" @click="sync"><a @click.stop="sync">Sync Profile</a></div>
                    </panel-dock>
                    <panel-dock v-if="citizen.data.orgs.main && $viewport.isLessThan('tablet')" :title="citizen.data.orgs.main.model ? citizen.data.orgs.main.mode : 'Organization'">
                        <citizen-org v-if="citizen.data.orgs && citizen.data.orgs.main" :org="citizen.data.orgs.main"/>
                    </panel-dock>
                    <!--citizen-org v-if="citizen.orgs && citizen.orgs.main" :org="citizen.orgs.main"/-->
                    <!--citizen-org v-if="citizen.info.orgs && citizen.info.orgs.affiliated" v-for="org in citizen.info.orgs.affiliated" :org="org" :affiliate="true"/-->
                </teleport>
            </client-only>
            <citizen-info :isOwner="isOwner" :citizen="citizen.data" @refresh="refresh" />
            <citizen-bio :bio="citizen.data.bio"/>
            <div class="citizen-tabs">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template #tab-title-vehicles>
                        VEHICLES ({{ vehicles.length }})
                    </template>
                    <template #tab-content-vehicles>
                        <vehicle-collection v-if="vehicles" 
                            :isOwner="isOwner" 
                            :vehicles="vehicles" 
                            @remove="removeVehicle">
                            <panel-button v-if="isOwner" 
                                text="Add Vehicle" 
                                @click="modals.vehicle = true" />
                        </vehicle-collection>
                    </template>

                    <template v-if="isOwner" #tab-title-location>
                        LOCATION
                    </template>
                    <template v-if="isOwner" #tab-content-location>
                        <citizen-location :isOwner="isOwner" :citizen="citizen"/>
                    </template>
                </layout-tabs>
            </div>

            <!-- Modals -->
            <layout-modal v-if="modals.vehicle" title="Add Vehicle" @close="modals.vehicle = false">
                <forms-vehicle @add="addVehicle" />
            </layout-modal>
            <modal-confirm v-if="modals.friend_confirm" text="Accept Friend Request?" @confirm="confirmFriend" @cancel="cancelFriend"></modal-confirm>
        </template>
        <widgets-no-result text="Citizen Not Found" v-else />
    </div>
</template>

<style>
.citizen.content {
    margin-top: 20px;
}

.citizen-tabs {
    margin-top: 20px;
}

.add-friend {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
}

.add-friend.interact {
    cursor: pointer;
}
</style>
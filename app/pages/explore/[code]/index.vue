<script setup>
const { $api } = useNuxtApp()
const route = useRoute()

const children = ref({})
const pois = ref([])
const tabs = ref([])
const initialTab = ref("locations")

const starmapLink = computed({
    get() {
        console.log(status.value)

        let link = `https://robertsspaceindustries.com/starmap?location=`

        if (status.value == "success") {
            link = link + `${location.value.data.rsi_code}`
            if (location.value.data.system) {
                return link.concat("&system=", `${location.value.data.system}`)
            }
            else {
                return link
            }
        } else {
            return ""
        }
    }
})

const systemLink = computed({
    get() {
        if (status.value == "success") {
            return `/explore/${location.value.data.system}`
        } else {
            return ""
        }
    }
})

//TODO: Clean this up...
async function getChildren() {
    tabs.value = []
    await $api(`/api/explore/locations/${route.params.code}/locations`, {
        key: 'getChildren',
        onResponse(_ctx) {
            children.value = _ctx.response._data.data
            if (children.value.orbitals.length) {
                tabs.value.push('locations')
            }
            if (children.value.pois.length) {
                tabs.value.push('pois')
            }
            initialTab.value = tabs.value[0]
        }
    })
}

//TODO make this work SSR
const {data: location, status} = await useAPI(`/api/explore/locations/${route.params.code}`, {
    key: 'getLocation',
    server: false,
    lazy: true,
    async onResponse(_ctx) {
        await getChildren()
    }
})
</script>

<template>
    <widgets-loading v-if="status != 'success'" />
    <div v-else class="system">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><router-link to="/explore">System List</router-link></div>
                    <div v-if="location.data.system" class="left-nav-button"><router-link :to="systemLink">Back to System</router-link></div>
                    <div class="left-nav-button"><a target="_blank" :href="starmapLink">Open in Starmap</a></div>
                </panel-dock>
            </teleport>
        </client-only>
        <explore-location v-if="location.data.name" :location="location.data" type="System">
            <div class="location-tabs" v-if="children">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template #tab-title-locations >
                        LOCATIONS ( {{children.orbitals.length}} )
                    </template>
                    <template #tab-content-locations>
                        <explore-location-list :locations="children.orbitals"/>
                    </template>

                    <template #tab-title-pois>
                        POIs ( {{ children.pois.length }} )
                    </template>
                    <template #tab-content-pois>
                        <explore-location-list :locations="children.pois"/>
                    </template>
                </layout-tabs>
            </div>      
        </explore-location>
        <widgets-no-result v-else text="Location Not Found"/>
    </div>
</template>

<style scoped>
    .system {
        width: 100%;
        display: flex;
    }
</style>
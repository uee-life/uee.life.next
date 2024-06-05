<template>
    <widgets-loading v-if="pending" />
    <div v-else class="system">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><router-link to="/explore">System List</router-link></div>
                    <div v-if="location.system" class="left-nav-button"><router-link :to="systemLink">Back to System</router-link></div>
                    <div class="left-nav-button"><a target="_blank" :href="starmapLink">Open in Starmap</a></div>
                </panel-dock>
            </teleport>
        </client-only>
        <explore-location v-if="location.name" :location="location" type="System">
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

<script setup>
const route = useRoute()

const location = ref({})

const children = ref({})
const pois = ref([])
const tabs = ref([])
const initialTab = ref("locations")

// needs fixing for systems
const starmapLink = computed({
    get() {
        if(location.value) {
            let link = `https://robertsspaceindustries.com/starmap?location=${location.value.rsi_code}`
            if (location.value.system) {
                link = link + `&system=${location.value.system}`
            }
            return link
        } else {
            return ""
        }
    }
})

const systemLink = computed({
    get() {
        return `/explore/${location.value.system}`
    }
})

//TODO make this work SSR
const {pending} = await useFetch(`/api/explore/locations/${route.params.code}`, {
    key: 'getLocation',
    server: false,
    lazy: true,
    async onResponse(_ctx) {
        location.value = _ctx.response._data
        await getChildren()
    }
})

async function getChildren() {
    tabs.value = []
    await $fetch(`/api/explore/locations/${route.params.code}/locations`, {
        key: 'getChildren',
        onResponse(_ctx) {
            console.log('got children: ', _ctx.response._data)
            children.value = _ctx.response._data
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

async function getPOIs() {
    //TODO
}
</script>

<style scoped>
    .system {
        width: 100%;
        display: flex;
    }
</style>
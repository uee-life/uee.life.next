<template>
    <widgets-loading v-if="pending" />
    <div v-else class="system">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div v-if="location.system" class="left-nav-button"><router-link :to="systemLink">Back to System</router-link></div>
                    <div class="left-nav-button"><a target="_blank" :href="starmapLink">Open in Starmap</a></div>
                </panel-dock>
            </teleport>
        </client-only>
        <explorer-location v-if="location.name" :location="location" type="System">
            <div class="location-tabs">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template #tab-title-locations>
                        LOCATIONS ( {{children.length}} )
                    </template>
                    <template #tab-content-locations>
                        <explorer-location-list :locations="children"/>
                    </template>

                    <template #tab-title-pois>
                        POIs ( {{ pois.length }} )
                    </template>
                    <template #tab-content-pois>
                        <!--poi-list :pois="pois"/--> 
                    </template>
                </layout-tabs>
            </div>      
        </explorer-location>
        <widgets-no-result v-else text="Location Not Found"/>
    </div>
</template>

<script setup>
const route = useRoute()

const location = ref({})

const children = ref([])
const pois = ref([])
const tabs = ref(["locations", "pois"])
const initialTab = ref("locations")

// needs fixing for systems
const starmapLink = computed({
    get() {
        if(location.value) {
            return `https://robertsspaceindustries.com/starmap?location=${location.value.rsi_code}&system=${location.value.system}`
        } else {
            return ""
        }
    }
})

const systemLink = computed({
    get() {
        return `/discover/${location.value.system}`
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
    await $fetch(`/api/explore/locations/${route.params.code}/locations`, {
        key: 'getChildren',
        onResponse(_ctx) {
            console.log('got children: ', _ctx.response._data)
            children.value = _ctx.response._data
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
<template>
    <client-only>
        <div class="system">
            <widgets-loading v-if="loading"/>
            <template v-else-if="found">
                <teleport to="#left-dock">
                    <panel-dock title="nav">
                        <div class="left-nav-button"><a target="_blank" :href="starmapLink">Open in Starmap</a></div>
                    </panel-dock>
                </teleport>
                <explorer-location v-if="found" :location="system" type="System">
                    <div class="location-tabs">
                        <layout-tabs :tabs="tabs" :initialTab="initialTab">
                            <template #tab-title-planets>
                                PLANETS ( {{planets.length}} )
                            </template>
                            <template #tab-content-planets>
                                <explorer-location-list :locations="planets" />
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
            </template>
            <widgets-no-result v-else text="System Not found"/>
        </div>
    </client-only>
</template>

<script setup>
const route = useRoute()

const tabs = ["planets", "pois"]
const initialTab = "planets"
const system = ref({})
const systems = ref({})
const planets = ref([])
const pois = ref([])

const loading = ref(true)
const found = ref(false)


const starmapLink = computed({
    get() {
        if(system) {
            return `https://robertsspaceindustries.com/starmap?location=${system.value.code}`
        } else {
            return ""
        }
    }
})

const sysLink = computed({
    get() {
        return `/system/${system.name}`
    }
})

async function getSystem() {
    await useFetch(`/api/explore/systems/${route.params.system}`, {
        key: 'getSystem',
        server: false,
        lazy: true,
        onResponse(_ctx) {
            const res = _ctx.response._data
            system.value = res
            console.log("res: ", res)
            if(res.code) {
                found.value = true
            }
            getPlanets()
            loading.value = false
        }
    })
}

async function getPlanets() {
    const sys_name = route.params.system
    await useFetch(`/api/explore/systems/${sys_name}/planets`, {
        onResponse(_ctx) {
            console.log(_ctx.response._data)
            planets.value = _ctx.response._data
        }
    })
}

async function getPOIs() {
    const sys_name = route.params.system
    if (Object.keys(systems).includes(sys_name)) {
        const sid = systems[sys_name].id
        /*this.$axios.get(`https://api.uee.life/locations/${sid}/pois`).then((res) => {
            if(res.status == 200) {
                this.pois = res.data
            }
        }).catch(error => {
            // eslint-disable-next-line
            console.error(error)
        })*/
    }
}

await getSystem()
</script>

<style scoped>
    .system {
        width: 100%;
        display: flex;
    }
</style>
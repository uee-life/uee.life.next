<template>
    <widgets-loading v-if="loading" />
    <div v-else class="system">
        <client-only>
            <teleport to="#left-dock">
            <panel-dock title="nav">
                <div class="left-nav-button"><router-link :to="systemLink">Back to System</router-link></div>
                <div class="left-nav-button"><a target="_blank" :href="starmapLink">Open in Starmap</a></div>
            </panel-dock>
            </teleport>
        </client-only>
        <explorer-location v-if="location.name" :location="location" type="System">
            <div class="location-tabs">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template slot="tab-title-locations">
                        LOCATIONS ( {{children.length}} )
                    </template>
                    <template slot="tab-content-locations">
                        <explorer-location-list :locations="children"/>
                    </template>

                    <template slot="tab-title-pois">
                        POIs ( {{ pois.length }} )
                    </template>
                    <template slot="tab-content-pois">
                        <!--poi-list :pois="pois"/--> 
                    </template>
                </layout-tabs>
            </div>      
        </explorer-location>
    </div>
</template>

<script setup>
const route = useRoute()

const location = ref({})
const loading = ref(true)

const children = ref([])
const pois = ref([])
const tabs = ref(["locations", "pois"])
const initialTab = ref("locations")

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
        return `/systems/${location.value.system}`
    }
})

async function getLocation() {
    await useFetch(`/api/explore/locations/${route.params.code}`, {
        key: 'getLocation',
        server: false,
        lazy: true,
        onResponse(_ctx) {
            location.value = _ctx.response._data
            loading.value = false
        }
    })
}

async function getChildren() {
    await useFetch(`/api/explore/locations/${route.params.code}/children`, {
        key: 'getChildren',
        server: false,
        lazy: true,
        onResponse(_ctx) {
            children.value = _ctx.response._data
        }
    })
}


await getLocation()

/*export default {
    layout: ({ isMobile }) => isMobile ? 'mobile' : 'default',
    name: "system",
    components: {
        Location,
        LocationList,
        PoiList
    },
    data() {
        return {
            tabs: ["locations", "pois"],
            initialTab: "locations",
            location: {},
            children: [],
            pois: []
        }
    },
    methods: {
        async getLocation() {
            const code = this.$route.params.location
            this.$axios.get(`https://api.uee.life/locations/${code}`).then(res => {
                if(res.status == 200) {
                    this.location = res.data
                }
            }).catch(error => {
                // eslint-disable-next-line
                console.error(error)
            });
        },
        async getLocations() {
            const code = this.$route.params.location
            this.$axios.get(`https://api.uee.life/locations/${code}/locations`).then(res => {
                if(res.status == 200) {
                    this.children = res.data
                }
            }).catch(error => {
                //eslint-disable-next-line
                console.error(error)
            });
        },
        async getPOIs() {
            const sid = this.$route.params.location
            this.$axios.get(`https://api.uee.life/locations/${sid}/pois`).then(res => {
                if(res.status == 200) {
                    this.pois = res.data
                }
            }).catch(error => {
                // eslint-disable-next-line
                console.error(error)
            })
        }
    },
    computed: {
        starmapLink() {
            if(this.location) {
                return `https://robertsspaceindustries.com/starmap?location=${this.location.code}`
            } else {
                return ""
            }
        },
        sysLink() {
            return `/system/${this.location.name}`
        }
    },
    mounted() {
        this.getLocation()
        this.getLocations()
        this.getPOIs()
    },
    watch: {
        $route: {
            handler: function () {
                this.getSystem()
                this.getPlanets()
                this.getPOIs()
            }
        }
    }
}*/
</script>

<style scoped>
    .system {
        width: 100%;
        display: flex;
    }
</style>
<template>
    <client-only>
        <div class="system">
            <teleport to="leftDock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" :href="starmapLink">Open in Starmap</a></div>
                </panel-dock>
            </teleport>
            <location :location="system" type="System">
                <div class="location-tabs">
                    <tabs :tabs="tabs" :initialTab="initialTab">
                        <template slot="tab-title-planets">
                            PLANETS ( {{planets.length}} )
                        </template>
                        <template slot="tab-content-planets">
                            <planet-list :planets="planets"/>
                        </template>

                        <template slot="tab-title-pois">
                            POIs ( {{ pois.length }} )
                        </template>
                        <template slot="tab-content-pois">
                            <poi-list :pois="pois"/> 
                        </template>
                    </tabs>
                </div>      
            </location>
        </div>
    </client-only>
</template>

<script setup>

const tabs = ["planets", "pois"]
const initialTab = "planets"
const system = ref({})
const systems = ref({})
const planets = ref([])
const pois = ref([])


const starmapLink = computed({
    get() {
        if(this.system) {
            return `https://robertsspaceindustries.com/starmap?location=${this.system.code}`
        } else {
            return ""
        }
    }
})

const sysLink = computed({
    get() {
        return `/system/${this.system.name}`
    }
})

async function getSystems() {

    await useFetch(`/api/systems`, {
        onResponse(_ctx) {
            const res = _ctx.response._data
            for (let s in res) {
                const sys = res[s]
                systems.value[sys.name] = sys
            }
        }
    })
}

async function getSystem() {
    console.log('getting system')
    const sys_name = this.$route.params.system
    console.log(this.systems, this.sys_name)
    if (Object.keys(this.systems).includes(sys_name)) {
        const sid = this.systems[sys_name].id
        this.$axios.get(`https://api.uee.life/locations/${sid}`).then((res) => {
            console.log(res.data)
            if(res.status == 200) {
                this.system = res.data
            }
        }).catch(error => {
            // eslint-disable-next-line
            console.error(error)
        });
    }
    
}

async function getPlanets() {
    const sys_name = this.$route.params.system
    if (Object.keys(this.systems).includes(sys_name)) {
        const sid = this.systems[sys_name].id
        this.$axios.get(`https://api.uee.life/locations/${sid}/locations`).then((res) => {
            if(res.status == 200) {
                this.planets = res.data
            }
        }).catch(error => {
            //eslint-disable-next-line
            console.error(error)
        });
    }
}

async function getPOIs() {
    const sys_name = this.$route.params.system
    if (Object.keys(this.systems).includes(sys_name)) {
        const sid = this.systems[sys_name].id
        this.$axios.get(`https://api.uee.life/locations/${sid}/pois`).then((res) => {
            if(res.status == 200) {
                this.pois = res.data
            }
        }).catch(error => {
            // eslint-disable-next-line
            console.error(error)
        })
    }
}


/*export default {
    layout: ({ isMobile }) => isMobile ? 'mobile' : 'default',
    name: "system",
    components: {
        Location,
        PlanetList,
        PoiList
    },
    data() {
        return {
            tabs: ["planets", "pois"],
            initialTab: "planets",
            system: {},
            systems: {},
            planets: [],
            pois: []
        }
    },
    methods: {
        async getSystems() {
            await this.$axios({
                url: 'https://api.uee.life/systems',
                method: 'GET'
            }).then((res) => {
                console.log('loaded systems')
                this.systems = {}
                for (let s in res.data) {
                    const sys = res.data[s]
                    this.systems[sys.name] = sys
                }
            }).catch((err) => {
                console.error(err)
            })
        },
        async getSystem() {
            console.log('getting system')
            const sys_name = this.$route.params.system
            console.log(this.systems, this.sys_name)
            if (Object.keys(this.systems).includes(sys_name)) {
                const sid = this.systems[sys_name].id
                this.$axios.get(`https://api.uee.life/locations/${sid}`).then((res) => {
                    console.log(res.data)
                    if(res.status == 200) {
                        this.system = res.data
                    }
                }).catch(error => {
                    // eslint-disable-next-line
                    console.error(error)
                });
            }
            
        },
        async getPlanets() {
            const sys_name = this.$route.params.system
            if (Object.keys(this.systems).includes(sys_name)) {
                const sid = this.systems[sys_name].id
                this.$axios.get(`https://api.uee.life/locations/${sid}/locations`).then((res) => {
                    if(res.status == 200) {
                        this.planets = res.data
                    }
                }).catch(error => {
                    //eslint-disable-next-line
                    console.error(error)
                });
            }
        },
        async getPOIs() {
            const sys_name = this.$route.params.system
            if (Object.keys(this.systems).includes(sys_name)) {
                const sid = this.systems[sys_name].id
                this.$axios.get(`https://api.uee.life/locations/${sid}/pois`).then((res) => {
                    if(res.status == 200) {
                        this.pois = res.data
                    }
                }).catch(error => {
                    // eslint-disable-next-line
                    console.error(error)
                })
            }
        }
    },
    computed: {
        starmapLink() {
            if(this.system) {
                return `https://robertsspaceindustries.com/starmap?location=${this.system.code}`
            } else {
                return ""
            }
        },
        sysLink() {
            return `/system/${this.system.name}`
        }
    },
    mounted() {
        this.getSystems().then(() => {
            this.getSystem()
            this.getPlanets()
            this.getPOIs()
        })
    },
    watch: {
        $route: {
            handler: function () {
                this.getSystems().then(() => {
                    this.getSystem()
                    this.getPlanets()
                    this.getPOIs()
                })
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
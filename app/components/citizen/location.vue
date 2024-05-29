<template>
    <div class="citizen-location">
        <div class="location-row">
            <span class="label">System:</span>
            <!--span v-if="edit.system">
                <select v-model="system">
                    <option disabled value="">Select System</option>
                    <option value="">Not Selected</option>
                    <option v-for="(sys, name) in data.systems" :key="sys.id" :value="{id: sys.id, name: sys.name}">{{ name }}</option>
                </select>
                <img @click="updateSystem" class="edit-button save" title="submit" src="@/assets/tick.png">
                <img @click="edit.system = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
            </span-->
            <span v-if="system">
                <router-link :to="systemLink">{{system.name}}</router-link>
                <img v-if="isOwner && !editing" @click="edit.system = true" class="edit-button edit" src="@/assets/edit.png">
            </span>
            <span v-else>Unknown<img v-if="isOwner && !editing" @click="edit.system = true" class="edit-button edit" src="@/assets/edit.png"></span>
        </div>
        <!--div class="location-row">
            <span class="label">Location:</span>
            <span v-if="edit.location">
                <select v-if="system && hasOptions(data.locations)" v-model="location">
                    <option disabled value="">Select Location</option>
                    <option value="">Not Selected</option>
                    <option v-for="(loc, name) in data.locations" :key="loc.id" :value="{id: loc.id, name: loc.name}">{{ name }}</option>
                </select>
                <img @click="updateLocation" class="edit-button save" title="submit" src="@/assets/tick.png">
                <img @click="edit.location = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
            </span>
            <div v-else-if="location">
                <router-link :to="locationLink">{{location.name}}</router-link>
                <img v-if="isOwner && !editing && hasOptions(data.bases)" @click="edit.location = true" class="edit-button edit" src="@/assets/edit.png">
            </div>
            <div v-else>Unknown<img v-if="isOwner && !editing && hasOptions(data.locations)" @click="edit.location = true" class="edit-button edit" src="~/assets/edit.png"></div>
        </div>
        <div class="location-row">
            <span class="label">Base:</span> 
            <span v-if="edit.base">
                <select v-if="location && hasOptions(data.bases)" v-model="base">
                    <option disabled value="">Select Home Base</option>
                    <option value="">Not Selected</option>
                    <option v-for="loc in data.bases" :key="loc.id" :value="{id: loc.id, name: loc.name}">{{ loc.name }}</option>
                </select>
                <img @click="updateBase" class="edit-button save" title="submit" src="@/assets/tick.png">
                <img @click="edit.base = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
            </span>
            <div v-else-if="base">
                <router-link :to="baseLink">{{base.name}}</router-link>
                <img v-if="isOwner && !editing && hasOptions(data.bases)" @click="edit.base = true" class="edit-button edit" src="@/assets/edit.png">
            </div>
            <div v-else>Unknown<img v-if="isOwner && !editing && hasOptions(data.bases)" @click="edit.base = true" class="edit-button edit" src="~/assets/edit.png"></div>
        </div-->
    </div>
</template>

<script setup>
const props = defineProps({
    citizen: {
        type: Object,
        required: true,
    },
    isOwner: {
        type: Boolean,
        default: false
    }
})

/*export default {
    name: 'citizen-location',
    props: ['home', 'isOwner'],
    data() {
        return {
            system: null,
            location: null,
            base: null,
            data: {
                systems: null,
                locations: null,
                bases: null
            },
            editing: false,
            edit: {
                system: false,
                location: false,
                base: false
            }
        }
    },
    computed: {
        user() {
            return this.$auth.user
        },
        systemLink() {
            return `#`
        },
        locationLink() {
            return `#`
        },
        baseLink() {
            return `#`
        }
    },
    methods: {
        ...mapActions([
            'setCitizen'
        ]),
        hasOptions(obj) {
            if (obj && Object.keys(obj).length) {
                return true
            } else {
                return false
            }
        },
        loadSystems() {
            this.$axios({
                url: 'https://api.uee.life/systems',
                method: 'GET'
            }).then((res) => {
                console.log('loaded systems')
                this.data.systems = {}
                for (let s in res.data) {
                    const sys = res.data[s]
                    this.data.systems[sys.name] = sys
                    if (this.home.system && sys.name === this.home.system.name) {
                        this.system = this.home.system
                    }
                }
            }).catch((err) => {
                console.error(err)
            })
        },
        loadLocations() {
            if(this.system) {
                this.$axios({
                    url: `https://api.uee.life/locations/${this.system.id}/locations`,
                    method: 'GET'
                }).then((res) => {
                    this.data.locations = {}
                    this.location = null
                    this.base = null
                    for (let l in res.data) {
                        const loc = res.data[l]
                        this.data.locations[loc.name] = loc
                        if (this.home.location && loc.name === this.home.location.name) {
                            this.location = this.home.location
                        }
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        },
        loadPOIs() {
            if(this.location) {
                this.$axios({
                    url: `https://api.uee.life/locations/${this.location.id}/pois`,
                    method: 'GET'
                }).then((res) => {
                    this.data.bases = {}
                    this.base = null
                    for (let i in res.data) {
                        const base = res.data[i]
                        this.data.bases[base.name] = base
                        if (this.home.base && base.name === this.home.base.name) {
                            this.base = this.home.base
                        }
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        },
        updateSystem() {
            this.edit.system = false
            if (this.home.system === null || this.system.name !== this.home.system.name) {
                this.location = null
                this.base = null
                this.save()
            }
        },
        updateLocation() {
            this.edit.location = false
            console.log(this.home.location)
            if (this.home.location === null || this.location.name !== this.home.location.name) {
                this.base = null
                this.save()
            }
        },
        updateBase() {
            this.edit.base = false
            if (this.home.base === null || this.base.name !== this.home.base.name) {
                this.save()
            }
        },
        async save() {
            console.log('saving location data...')
            const data = {
                system: this.system,
                location: this.location,
                base: this.base
            }
            await this.$axios({
                url: `https://api.uee.life/citizens/${this.user['https://uee.life/app_metadata'].handle}/location`,
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json; charset=utf-8"
                },
                data: data
            }).then((res) => {
                this.$emit('refresh')
            }).catch((err) => {
                console.error(err)
            })
        }
    },
    watch: {
        home: function() {
            this.loadSystems()
        },
        system: function() {
            if(this.system) {
                this.loadLocations()
            }
        },
        location: function() {
            if(this.location) {
                this.loadPOIs()
            }
        },
        edit: {
            handler: function (val, oldVal) {
                // prevents editing more than one thing at a time!
                this.editing = false
                for (let i in val) {
                    if (val[i]) {
                        this.editing = true
                    }
                }
            },
            deep: true
        }
    }
}*/
</script>

<style scoped>
    .citizen-location {
        display: flex;
        flex-direction: column;
    }
    .location-row {
        display: flex;
        flex-grow: 1;
    }
    .location-row .label {
        width: 70px;
    }
    .citizen-location .labels {
        display: flex;
        flex-direction: column;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
    }
    .citizen-location .data {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 19.5px;
        margin-left: 10px;
        color: #dbf3ff;
    }
    .line-item {
        display: flex;
        justify-content: space-between;
    }

    .line-item select {
        color: #39ced8;
        background: url('/images/fading-bars.png') repeat;
        border: 1px solid #546f84;
        margin: 2px;
    }

    .line-item select option {
        background-color: rgb(13, 46, 66);
    }
</style>
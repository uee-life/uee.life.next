<script setup>
const {$api} = useNuxtApp()
const auth = useAuthStore()

const {data: locations, status: locationStatus} = useAPI(`/api/explore/locations`, {
    key: 'getLocations'
})

const {data: vehicles, status: vehicleStatus, refresh} = useAPI(`/api/vehicles/models`, {
    key: 'getVehicles'
})

const result = ref(null)
const input_location = ref("")
const input_vehicle = ref("")

const modals = ref({
    add: false
})

const isAdmin = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && ['capn_flint', 'capn_nemo'].includes(auth.citizen.handle.toLowerCase())
    }
})

const noResultText = computed({
    get() {
        if (input.value.length >=3) {
            if(pending.value) {
                return "Searching..."
            } else {
                return "No Results"
            }
        } else {
            return "Search Locations/Vehicles"
        }
    }
})

const filteredVehicles = computed({
    get() {
        if (vehicleStatus.value == 'success') {
            if (input_vehicle.value.length < 3) {
                return []
            }

            return vehicles.value.data.models.filter(model => {
                return model.identifier.toLowerCase().includes(input_vehicle.value.toLowerCase()) ||
                        model.manufacturer.toLowerCase().includes(input_vehicle.value.toLowerCase()) ||
                        model.model.toLowerCase().includes(input_vehicle.value.toLowerCase())
            })
        }
        return []
    }
})


const filteredLocations = computed({
    get() {
        if (locationStatus.value == 'success') {
            if (input_location.value.length < 3) {
                return []
            }

            return locations.value.data.filter(loc => {
                return loc.code.toLowerCase().includes(input_location.value.toLowerCase()) ||
                        loc.name.toLowerCase().includes(input_location.value.toLowerCase())
            })
        }
        return []
    }
})

function systemImage(img) {
    if(img) {
      return img
    } else {
      return "/images/default/system.jpg"
    }
}

function systemType(sys) {
    if(sys.type == "BINARY") {
        return "Binary Star System"
    } else if (sys.type == "SYSTEM") {
        return "Star System"
    } else {
      return sys.type
    }
}

const clearInput = (box) => {
    if (box == 'location') {
        input_vehicle.value = ''
    } else {
        input_location.value = ''
    }
}

const goToVehicle = (id) => {
    navigateTo(`/vehicles/${id}`)
}
</script>

<template>
    <widgets-loading v-if="locationStatus != 'success' || vehicleStatus != 'success'"/>

    <div class="system-list">
      <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" href="https://robertsspaceindustries.com/starmap">Open Starmap</a></div>
                </panel-dock>
                <panel-dock title="find location" class="search-box">
                    <input class="search-input" @input="clearInput('location')" v-model="input_location" placeholder="Location Name"/>
                </panel-dock>
                <panel-dock title="find vehicle" class="search-box">
                    <input class="search-input" @input="clearInput('vehicle')" v-model="input_vehicle" placeholder="Manufacturer/Vehicle"/>
                </panel-dock>
                <panel-dock v-if="isAdmin" class="actions" title="Admin">
                    <div class="left-nav-button" @click="modals.add = true">Add New Vehicle</div>
                </panel-dock>
            </teleport>
        </client-only>
        <template v-if="filteredLocations.length > 0 || filteredVehicles.length > 0" >
            <vehicle-summary-model v-for="vehicle in filteredVehicles" class="vehicle-model-summary"
                :vehicle="vehicle" 
                @selected="goToVehicle"></vehicle-summary-model>

            <explore-location-summary 
                v-for="location in filteredLocations" :link="`/explore/${location.code}`" :loc="{thumbnail: systemImage(location.image_url), name: location.name}">
                <div><span class="data">{{ systemType(location) }}</span></div>
                <nuxt-img class="icon" v-if="location.affiliation != 'None'" :src="`/images/factions/icon-${location.affiliation}.png`"/>
            </explore-location-summary>
        </template>
        <widgets-no-result v-else text="Search UEE Data" />
        <layout-modal v-if="modals.add" title="Add a vehicle model" @close = "modals.add = false">
            <forms-vehicle-model @close="modals.add = false && refresh()"/>
        </layout-modal>
    </div>
</template>

<style scoped>
.layout-enter-active,
.layout-leave-active {
    transition-property: opacity;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;
}
.layout-enter,
.layout-leave-to {
    opacity: 0;
}

.system-list {
    display: flex;
    flex-wrap: wrap;
    flex-basis: fit-content;
    margin-left: -5px;
    margin-right: -5px;
    margin-top: 15px;
}

.data {
    color: #dbf3ff;
}

.icon {
  position: absolute;
  width: 30px;
  right: 5px;
  bottom: 5px;
}
</style>
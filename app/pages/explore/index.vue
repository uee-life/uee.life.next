<template>
    <widgets-loading v-if="vehicleStatus != 'success'"/>
    <div v-else class="system-list">
      <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" href="https://robertsspaceindustries.com/starmap">Open Starmap</a></div>
                </panel-dock>
                <panel-dock title="find location" class="search-box">
                    <input class="search-input" @keyup.enter="getResults()" @input="autoGetResults('poi')" v-model="input_poi" placeholder="Location Name"/>
                </panel-dock>
                <panel-dock title="find vehicle" class="search-box">
                    <input class="search-input" v-model="input_vehicle" placeholder="Manufacturer/Vehicle"/>
                </panel-dock>
            </teleport>
        </client-only>
        <explore-location-summary v-if="result" v-for="sys in result.data" :link="`/explore/${sys.code}`" :loc="{thumbnail: systemImage(sys.image_url), name: sys.name}">
            <div><span class="data">{{ systemType(sys) }}</span></div>
            <img class="icon" v-if="sys.affiliation != 'None'" :src="`/images/factions/icon-${sys.affiliation}.png`"/>
        </explore-location-summary>
        <panel 
            v-for="vehicle in filteredVehicles"
            class="ship-model">
            <img :src="vehicleImage(vehicle.identifier)"  class="ship-image"/>
            <div class="ship-info">
                <div>{{ `${vehicle.manufacturer} ${vehicle.model}` }}</div>
                <div>{{ `${vehicle.career} - ${vehicle.role}`}}</div>
                <div>{{ `Cargo: ${vehicle.cargo}` }}</div>
                <div>{{ `Crew: ${vehicle.max_crew}` }}</div>
            </div>
            <div class="mask"></div>
        </panel>
    </div>
</template>
  
<script setup>
const {$api} = useNuxtApp()


const {data: systems, status: poiStatus} = useAPI(`/api/explore/systems`, {
    key: 'getPOIs'
})

const {data: vehicles, status: vehicleStatus, refresh} = useAPI(`/api/vehicles/models`, {
    key: 'getVehicle'
})

const result = ref(null)
const input_poi = ref("")
const input_vehicle = ref("")

const vehicleImage = (id) => {
    console.log(`vehicle: ${id}`)
    return `/images/ships/small/${id}.jpg`
}

async function autoGetResults(searchType) {

    if (searchType == 'poi' ) {
        input_vehicle.value = ""

        if (input_poi.value.length >= 3) {
            // pending.value = true
            getPOIResults()
        }
    } else if (searchType == 'vehicle') {
        input_poi.value = ""

        if (input_vehicle.value.length >= 3) {
            // pending.value = true
            getVehicleResults()
        }
    } else {
        result.value = null
    }
}

const filteredVehicles = computed({
    get() {
        if ( input_vehicle.length < 3 ){
            return null
        }

        return vehicles.value.data.models.filter(model => {
            console.log(model)
            return model.identifier.toLowerCase().includes(input_vehicle.value.toLowerCase()) ||
                    model.manufacturer.toLowerCase().includes(input_vehicle.value.toLowerCase()) ||
                    model.model.toLowerCase().includes(input_vehicle.value.toLowerCase())
        })
    }
})

async function getPOIResults() {
    const data = {
        search: input_poi.value
    }
    result.value = await $api(`/api/search/location`, {
        method: 'POST',
        body: data,
        onResponse(_ctx) {
//            pending.value = false
        }
    })
    console.log(result)
}

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
</script>

<style>
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
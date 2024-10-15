<template>
    <widgets-loading v-if="poiStatus != 'success'"/>
    <div v-else class="system-list">
        
      <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" href="https://robertsspaceindustries.com/starmap">Open Starmap</a></div>
                </panel-dock>
                <panel-dock title="find location" class="search-box">
                    <input class="search-input" v-model="input_poi" @input="clearInput('poi')" placeholder="Location Name"/>
                </panel-dock>
                <panel-dock title="find vehicle" class="search-box">
                    <input class="search-input" v-model="input_vehicle" @input="clearInput('vehicle')" placeholder="Manufacturer/Vehicle"/>
                </panel-dock>
            </teleport>
        </client-only>

        <panel 
            v-for="vehicle in filteredVehicles"
            class="vehicle-model">
            <img :src="vehicleImage(vehicle.identifier)"  class="ship-image"/>
            <div class="ship-info">
                <div>{{ `${vehicle.manufacturer} ${vehicle.model}` }}</div>
                <div>{{ `${vehicle.career} - ${vehicle.role}`}}</div>
                <div>{{ `Cargo: ${vehicle.cargo}` }}</div>
                <div>{{ `Crew: ${vehicle.max_crew}` }}</div>
            </div>
            <div class="mask"></div>
        </panel>
        <explore-location-summary 
            v-for="poi in filteredPOIs" :link="`/explore/${poi.code}`" :loc="{thumbnail: systemImage(poi.image_url), name: poi.name}">
            <div><span class="data">{{ systemType(poi) }}</span></div>
            <img class="icon" v-if="poi.affiliation != 'None'" :src="`/images/factions/icon-${poi.affiliation}.png`"/>
        </explore-location-summary>
    </div>
</template>
  
<script setup>
const {$api} = useNuxtApp()


const {data: pois, status: poiStatus} = useAPI(`/api/explore/systems`, {
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

async function clearInput(inputType) {

    if (inputType == 'poi' ) {
        input_vehicle.value = ""
    } else if (inputType == 'vehicle') {
        input_poi.value = ""
    }
}

const filteredVehicles = computed({
    get() {
        if ( input_vehicle.length < 3 ){
            return null
        }

        return vehicles.value.data.model.filter(model => {
            console.log(model)
            return model.identifier.toLowerCase().includes(input_vehicle.value.toLowerCase()) ||
                    model.manufacturer.toLowerCase().includes(input_vehicle.value.toLowerCase()) ||
                    model.model.toLowerCase().includes(input_vehicle.value.toLowerCase())
        })
    }
})


const filteredPOIs = computed({
    get() {
        if ( input_poi.length < 3 ){
            return null
        }

        return pois.value.data.filter(system => {
            //console.log(model)
            return system.code.toLowerCase().includes(input_poi.value.toLowerCase()) ||
                    system.name.toLowerCase().includes(input_poi.value.toLowerCase())
        })
    }
})

/*
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
*/

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
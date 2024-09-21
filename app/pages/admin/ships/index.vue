<script setup>
const { $api } = useNuxtApp()
const result = ref(null)
const filter = ref('')
const modal = ref({
    edit: false,
    add: false
})
const selected = ref(null)

const updateVehicles = async () => {
    result.value = await $api(`/api/admin/vehicleModels/import`)
    .catch((error) => {
        console.error(error)
    })
}

const filteredVehicles = computed({
    get() {
        return vehicleModels.value.data.models.filter(model => {
            console.log(model)
            return model.identifier.toLowerCase().includes(filter.value.toLowerCase()) ||
                    model.manufacturer.toLowerCase().includes(filter.value.toLowerCase()) ||
                    model.model.toLowerCase().includes(filter.value.toLowerCase())
        })
    }
})

const shipImage = (id) => {
    console.log(`vehicle: ${id}`)
    return `/images/ships/small/${id}.jpg`
}

const editVehicleModel = (s) => {
    console.log('editing: ' + s)
    selected.value = s
    modal.value.edit = true
}

async function addVehicle(ship) {
    modal.value.add = false
    await $api('/api/admin/vehicleModels/add', {
        method: 'POST',
        body: ship
    })
}

async function editVehicle(ship) {
    modal.value.edit = false
    await $api('/api/admin/vehicleModels/add', {
        method: 'POST',
        body: ship
    })
}


const {data: vehicleModels, status} = useAPI('/api/vehicles/models', {
    key: 'getVehicleModels',
    server: false,
    lazy: true,
})
</script>

<template>
    <div class="main">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div class="left-nav-button" @click="modal.add = true">Add Ship Model</div>
                    <div class="left-nav-button" @click="updateShips">
                        Sync with Erkul
                    </div>
                </panel-dock>
                <panel-dock title="Filter ships">
                    <div class="filter">
                        <input class="filter-box" type="text" v-model="filter" placeholder="Filter Ships..." />
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <panel
            v-if="status == 'success'" 
            v-for="vehicle in filteredVehicles"
            class="ship-model">
            <img :src="vehicleImage(vehicle.identifier)"  class="ship-image"/>
            <div class="ship-info">
                <div>{{ `${vehicle.manufacturer} ${vehicle.model}` }}</div>
                <div>{{ `${vehicle.career} - ${vehicle.role}`}}</div>
                <div>{{ `Cargo: ${vehicle.cargo}` }}</div>
                <div>{{ `Crew: ${vehicle.max_crew}` }}</div>
            </div>
            <div class="mask" @click="editVehicleModel(vehicle)"></div>
        </panel>
        
        <layout-modal v-if="modal.edit" title="Edit vehicle model" @close = "modal.edit = false">
            <forms-vehicle-model 
                :data="shipModels.data"
                :ship-info="selected"
                @submit="editVehicle"/>
        </layout-modal>
        <layout-modal v-if="modal.add" title="Add a vehicle model" @close = "modal.add = false">
            <forms-vehicle-model
                :data="shipModels.data"
                @submit="addVehicle"
                />
        </layout-modal>

    </div>
</template>

<style scoped>

.main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding-top: 20px;
}

.mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: pointer;
}

.ship-image {
    width: 150px;
}

.ship-info {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
}

 
</style>
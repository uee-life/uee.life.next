<template>
    <form v-if="status == 'success'" @submit.prevent="addVehicle" class="vehicle-form">
        <div>
            Manufacturer: 
            <select v-model="make">
                <option disabled value="">Select Manufacturer</option>
                <option v-for="m in vehicleModels.data.makes" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
        </div>
        <div>
            Model:
            <select v-model="vehicle">
                <option disabled value="">Select Model</option>
                <option v-for="s in filteredShips" :key="s.id" :value="s">{{ s.model }}</option>                
            </select>
        </div>
        <div>Name: <input type="text" v-model="name"> (optional)</div>
        <input type="submit" value="Add" />
    </form>
</template>

<script setup>
const { $api } = useNuxtApp()
const emit = defineEmits(['add'])

const vehicle = ref(null)
const make = ref("Origin")
const name = ref("")

const filteredShips = computed({
    get() {
        return vehicleModels.value.data.models.filter(model => {
            return model.manufacturer.toLowerCase().includes(make.value.toLowerCase())
        })
    }
})

const addVehicle = () => {
    if(vehicle.value) {
        const data = {
            id: vehicle.value.identifier,
            name: name.value
        }
        emit('add', data)
    }          
}

const {data: vehicleModels, status} = useAPI('/api/vehicles/models')
</script>

<style>
.vehicle-form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 15px;
}
input {
    margin-bottom: 5px;
}
</style>
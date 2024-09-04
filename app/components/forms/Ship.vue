<template>
    <form v-if="status == 'success'" @submit.prevent="addShip" class="ship-form">
        <div>
            Manufacturer: 
            <select v-model="make">
                <option disabled value="">Select Manufacturer</option>
                <option v-for="m in ships.data.makes" :key="m.tag" :value="m.tag">{{ m.name }}</option>
            </select>
        </div>
        <div>
            Model:
            <select v-model="ship">
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

const ship = ref(null)
const make = ref("Origin")
const name = ref("")

const filteredShips = computed({
    get() {
        return ships.value.data.models.filter(ship => {
            return ship.manufacturer.toLowerCase().includes(make.value.toLowerCase())
        })
    }
})

const addShip = () => {
    if(ship.value) {
        const data = {
            id: ship.value.identifier,
            name: name.value
        }
        emit('add', data)
    }          
}

const {data: ships, status} = useAPI('/api/ships/models')
</script>

<style>
.ship-form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 15px;
}
input {
    margin-bottom: 5px;
}
</style>
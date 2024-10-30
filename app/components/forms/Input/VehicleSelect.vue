<script setup>
const emit = defineEmits(['selected'])
const props = defineProps({
    vehicles: {
        type: Array,
        required: true
    }
})

const filter = ref("")
const vehicle = ref(null)

const filteredItems = computed({
    get() {
        return vehicleFilter(filter.value, props.vehicles)
    }
})

const resultClass = (item) => {
    if (item.id == vehicle.value) {
        return "result selected"
    } else {
        return "result"
    }
}

const selected = (id) => {
    console.log('selected', id)
    vehicle.value = id
    emit('selected', id)
}
</script>

<template>
    <div>
        <input class="input"
            id="vehicle"
            v-model="filter"
            placeholder="Filter Vehicles" />
        <div class="results">
            <div v-for="item in filteredItems" :key="item.identifier">
                <vehicle-summary-small :vehicle="item" @selected="selected" :class="resultClass(item)"/>
            </div>
        </div>
    </div>   
</template>

<style scoped>
input {
    margin: 5px 0;
}
.results {
    max-height: 70vh;
    overflow: auto;
}
.result {
    margin: 2px 0;
    padding: 5px;
}
.result.selected {
    border: 1px solid green;
    background: rgba(0,255,55,0.1)
}
</style>
<script setup>
const emit = defineEmits(['add', 'remove'])

const props = defineProps({
    vehicles: {
        type: Array,
        default: function () {
            return []
        }
    },
    view: {
        type: String,
        default: 'large'
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    showSummary: {
        type: Boolean,
        default: false
    }
})

const showModal = ref(false)
const search = ref('')

function addVehicle(vehicle) {
    showModal.value = false
    emit('add', vehicle)
}
function removeVehicle(vehicle) {
    emit('remove', vehicle)
}
function setFilter(value) {
    search.value = value
}

function selected(vehicle) {
    console.log('collection vehicle selected: ', vehicle)
}

const filteredVehicles = computed({
    get () {
        return vehicleFilter(search.value, props.vehicles)
    }
})
</script>

<template>
    <div id="fleet-view" class="fleet-view">
        <vehicle-collection-summary v-if="showSummary"  
            :fleet="vehicles"
            @filter="setFilter"/>
        <vehicle-collection-list 
            :vehicles="filteredVehicles"
            :isAdmin="isOwner"
            :filter="search"
            @selected="selected"
            @remove="removeVehicle"/>
        <slot></slot>
    </div>
</template>

<style scoped>
    .fleet-view {
        position: relative;
        margin-bottom: 20px;
    }
</style>
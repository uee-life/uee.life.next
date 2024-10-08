<template>
    <div class="vehicle-list">
        <template v-if="vehicles.length > 0">
            <div class="view-controls">
                <div class="display-style" v-if="showControls">
                    <template v-if="!isMobile">Display: <a @click="show('large')">Large</a> | <a @click="show('small')">Small</a> | <a @click="show('table')">Table</a></template>
                </div>
                <div class="filter">
                    <input class="filter-box" type="text" v-model="search" placeholder="Filter list..." />
                </div>
            </div>
            <div class="vehicles">
                <template v-if="isMobile || display == 'small'">
                    <vehicle-summary-small v-for="(s, index) in filteredVehicles" 
                        :key="s.id" 
                        :vehicle="s" 
                        :index="index" 
                        :isAdmin="isAdmin" 
                        @selected="selected" 
                        @remove="remove" />
                </template>
                <template v-else-if="display == 'table'">
                    <vehicle-table 
                        :vehicles="filteredVehicles" 
                        @selected="selected"/>
                </template>
                <template v-else>
                    <vehicle-summary v-for="(s, index) in filteredVehicles" 
                        :key="s.id" 
                        :vehicle="s" 
                        :index="index" 
                        :isAdmin="isAdmin" 
                        @selected='selected' 
                        @remove="remove"/>
                </template>
            </div>
        </template>
        <widgets-no-result v-else text="No Vehicles Found"/>
    </div>
</template>

<script setup>

const props = defineProps({
    vehicles: {
        type: Array,
        default: function () {
            return []
        }
    },
    filter: {
        type: String,
        default: ''
    },
    view: {
        type: String,
        default: 'large'
    },
    showControls: {
        type: Boolean,
        default: true
    },
    showFilter: {
        type: Boolean,
        default: true
    },
    showOwner: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isMobile: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['selected','remove', 'setFilter'])

const search = ref(props.filter)
const display = ref('large')

const filteredVehicles = computed({
    get() {
        return vehicleFilter(search.value, props.vehicles)
    }
})

function show(selected) {
    display.value = selected
}

function selected(vehicle) {
    emit('selected', vehicle)
}
function remove(vehicle) {
    emit('remove', vehicle)
}

watch(
    () => props.filter,
    () => {
        search.value = props.filter
    }
)
</script>

<style scoped>
    .view-controls {
        margin: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }

    .vehicles {
        display: flex;
        flex-wrap: wrap;
        opacity: 1;
        margin: 0 -5px;
    }
    .display-style {
        cursor: pointer;
    }
</style>
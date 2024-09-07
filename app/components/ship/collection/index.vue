<template>
    <div id="fleet-view" class="fleet-view">
        <ship-collection-summary v-if="showSummary"  
            :fleet="ships"
            @filter="setFilter"/>
        <ship-collection-list 
            :ships="filteredShips"
            :isAdmin="isOwner"
            @selected="selected"
            @remove="removeShip"/>
        <slot></slot>
    </div>
</template>

<script setup>
const emit = defineEmits(['add', 'remove'])

const props = defineProps({
    ships: {
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

function addShip(ship) {
    showModal.value = false
    emit('add', ship)
}
function removeShip(ship) {
    emit('remove', ship)
}
function setFilter(value) {
    search.value = value
}

function selected(ship) {
    console.log('collection ship selected: ', ship)
}

const filteredShips = computed({
    get () {
        return props.ships.filter(ship => {
            return ship.identifier.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.manufacturer.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.model.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.career.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.role.toLowerCase().includes(search.value.toLowerCase()) /*||
                ship.size_text.toLowerCase().includes(this.search.toLowerCase())*/
        })
    }
})
</script>

<style scoped>
    .fleet-view {
        position: relative;
        margin-bottom: 20px;
    }
</style>
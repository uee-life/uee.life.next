<template>
    <div id="fleet-view" class="fleet-view">
        <fleet-summary v-if="showSummary" @filter="setFilter" :fleet="ships"/>
        <fleet-list :ships="filteredShips" @remove="removeShip" :isAdmin="isOwner"/>
        <panel-button v-if="isOwner" text="Add Ship" class="add-ship" @click="showModal = true" />
        <layout-modal v-if="showModal" title="Add Ship" @close="showModal = false">
            <fleet-add @add="addShip" />
        </layout-modal>
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
    console.log('(view) removing ship: ', ship)
    emit('remove', ship)
}
function setFilter(value) {
    search.value = value
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
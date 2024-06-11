<template>
    <div id="fleet-view" class="fleet-view">
        <fleet-summary v-if="showSummary" @filter="setFilter" :fleet="ships"/>
        <fleet-list :ships="filteredShips" @selected="selected" @remove="removeShip" :isAdmin="isOwner"/>
        <panel v-if="isOwner" class="add-ship" @click="showModal = true">
            ADD SHIP
        </panel>
        <layout-modal v-if="showModal" title="Add Ship" @close="showModal = false">
            <fleet-add @add="addShip" />
        </layout-modal>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'
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

function selected(ship) {
    //navigateTo(`/ships/${this.shipID(ship)}`)
    //this.$emit('selected', ship)
    console.log(`selected: ${ship}`)
}
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
            return ship.identifier.toLowerCase().includes(search.value.toLowerCase()) //||
                /*ship.make_text.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.model.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.type_text.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.focus_text.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.size_text.toLowerCase().includes(this.search.toLowerCase())*/
        })
    }
})
</script>

<style scoped>
    .add-ship {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
        max-width: 100vh;
    }
    .fleet-view {
        position: relative;
        margin-bottom: 20px;
    }
    .fleet-view a {
        cursor: pointer;
    }

</style>
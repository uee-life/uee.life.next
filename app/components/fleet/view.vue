<template>
    <div id="fleet-view" class="fleet-view">
        <fleet-summary v-if="showSummary" @filter="setFilter" :fleet="ships"/>
        <fleet-list :ships="filteredShips" @selected="selected" @remove="removeShip" :isAdmin="isOwner"/>
        <!--main-panel v-if="isOwner" class="add-ship" @click="showModal = true">
            ADD SHIP
        </main-panel>
        <modal v-if="showModal" title="Add Ship" @close="showModal = false">
            <ship-form @add="addShip" />
        </modal-->
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

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
    this.$router.push(`/ships/${this.shipID(ship)}`)
    //this.$emit('selected', ship)
}
function addShip(ship) {
    this.showModal = false
    this.$emit('add', ship)
}
function removeShip(ship) {
    this.$emit('remove', ship)
}
function setFilter(value) {
    this.search = value
}

const filteredShips = computed({
    get () {
        console.log(props.ships)
        return props.ships.filter(ship => {
            return ship.short_name.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.make_text.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.model.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.type_text.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.focus_text.toLowerCase().includes(this.search.toLowerCase()) ||
                ship.size_text.toLowerCase().includes(this.search.toLowerCase())
        })
    }
})
</script>

<style scoped>
    .add-ship {
        margin: 6px;
        text-align: center;
        cursor: pointer;
    }
    .fleet-view {
        position: relative;
        margin-bottom: 20px;
    }
    .fleet-view a {
        cursor: pointer;
    }

</style>
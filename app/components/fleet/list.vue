<template>
    <div class="ship-list">
        <template v-if="ships.length > 0">
            <div class="view-controls">
                <div class="display-style" v-if="showControls">
                    <template v-if="!isMobile">Display: <a @click="show('large')">Large</a> | <a @click="show('small')">Small</a> | <a @click="show('table')">Table</a></template>
                </div>
                <div class="filter">
                    <input class="filter-box" type="text" v-model="search" placeholder="Filter list..." />
                </div>
            </div>
            <div class="ships">
                <template v-if="isMobile || display == 'small'">
                    <ship-summary-small @selected="selected" v-for="(s, index) in filteredShips" :key="s.id" :ship="s" :index="index" :isAdmin="isAdmin" @remove="remove" />
                </template>
                <template v-else-if="display == 'table'">
                    <ship-table @selected="selected" :ships="filteredShips" />
                </template>
                <template v-else>
                    <ship-summary v-for="(s, index) in filteredShips" :key="s.id" :ship="s" :index="index" :isAdmin="isAdmin" @remove="remove"/>
                </template>
            </div>
        </template>
        <widgets-no-result v-else text="No Ships Found"/>
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

const emit = defineEmits(['remove'])

const search = ref('')
const display = ref('large')

const filteredShips = computed({
    get() {
        return props.ships.filter(ship => {
            return ship.identifier.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.name.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.manufacturer.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.model.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.career.toLowerCase().includes(search.value.toLowerCase()) ||
                ship.role.toLowerCase().includes(search.value.toLowerCase()) //||
//                ship.size_text.toLowerCase().includes(search.value.toLowerCase()) ||
//                ship.owner.name.toLowerCase().includes(search.value.toLowerCase()) ||
//                ship.owner.handle.toLowerCase().includes(search.value.toLowerCase())
        })
    }
})

function show(selected) {
    display.value = selected
}

function selected(ship) {
    console.log('selected emitted')
}
function remove(ship) {
    console.log('remove clicked! ', ship)
    emit('remove', ship)
}

onMounted(() => {
    display.value = props.view
    if (props.ships.length > 0) {
        gsap.to(".ships", {duration: 1, opacity: 1})
    }
})
</script>

<style>
    .view-controls {
        margin: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    .no-ships {
        text-align: center;
        font-size: 18px;
        color: #dbf3ff;
    }
    .ships {
        display: flex;
        flex-wrap: wrap;
        opacity: 1;
        margin: 0 -5px;
    }
    .display-style {
        cursor: pointer;
    }
</style>
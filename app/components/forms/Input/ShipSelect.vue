<script setup>
const emit = defineEmits(['selected'])
const props = defineProps({
    ships: {
        type: Array,
        required: true
    }
})

const filter = ref("")
const ship = ref(null)

const filteredItems = computed({
    get() {
        return filterShips(filter.value, props.ships)
    }
})

const resultClass = (item) => {
    if (item.id == ship.value) {
        return "result selected"
    } else {
        return "result"
    }
}

const selected = (id) => {
    console.log('selected', id)
    ship.value = id
    emit('selected', id)
}
</script>

<template>
    <div class="ship-picker">
        <input class="input"
            id="ship"
            v-model="filter"
            placeholder="Filter Ships" />
        <div class="results">
            <div v-for="ship in filteredItems" :key="ship.identifier">
                <ship-summary-small :ship="ship" @selected="selected" :class="resultClass(ship)"/>
            </div>
        </div>
    </div>   
</template>

<style>
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
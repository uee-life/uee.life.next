<script setup>
const { $api } = useNuxtApp()

const emit = defineEmits(['add'])
const props = defineProps({
    shipPool: {
        type: Array,
        required: true
    }
})

const ship = ref(null)

const canSubmit = computed({
    get() {
        if (ship.value) {
            return "active"
        } else {
            return "deactivated"
        }
    }
})

const selected = (id) => {
    ship.value = id
}

const addShip = () => {
    emit('add', ship.value)
}
</script>

<template>
    <form @submit.prevent="addShip" class="ship-form">
        <forms-input-ship-select :ships="shipPool" @selected="selected"/>
        {{ ship }}
        <input type="submit" :class="canSubmit" value="Add" />
    </form>
</template>

<style scoped>
input.active {
    cursor: pointer;
}

input.deactivated {
    cursor: not-allowed;
    opacity: 0.2;
}
</style>
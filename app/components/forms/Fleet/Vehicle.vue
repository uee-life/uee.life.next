<script setup>
const { $api } = useNuxtApp()

const emit = defineEmits(['add'])
const props = defineProps({
    vehiclePool: {
        type: Array,
        required: true
    }
})

const vehicle = ref(null)

const canSubmit = computed({
    get() {
        if (vehicle.value) {
            return "active"
        } else {
            return "deactivated"
        }
    }
})

const selected = (id) => {
    vehicle.value = id
}

const addShip = () => {
    emit('add', vehicle.value)
}
</script>

<template>
    <form @submit.prevent="addShip">
        <forms-input-vehicle-select :vehicles="vehiclePool" @selected="selected"/>
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
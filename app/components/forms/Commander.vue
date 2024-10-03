<template>
    <form @submit.prevent="addCommander()" class="cmdr-form">
        <label for="citizen">Select Citizen:</label>
        <forms-input-citizen @selected="selected" />
        <input type="submit" :class="canSubmit" value="Add" />
    </form>
</template>

<script setup>
const { $api } = useNuxtApp()
const emit = defineEmits(['submit'])

const props = defineProps({
    roleSelect: {
        type: Boolean,
        default: true
    }
})

const cmdr = ref('')

const canSubmit = computed({
    get() {
        if (cmdr.value.length > 0) {
            return "active"
        } else {
            return "deactivated"
        }
    }
})

const selected = (citizen) => {
    cmdr.value = citizen.handle
}

const addCommander = () => {
    if(cmdr.value) {
        emit('submit', cmdr.value) 
    }        
}
</script>

<style scoped>
.cmdr-form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 15px;
}

input.active {
    cursor: pointer;
}

input.deactivated {
    cursor: not-allowed;
    opacity: 0.2;
}
</style>
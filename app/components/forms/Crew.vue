<template>
    <form @submit.prevent="addCrew()" class="crew-form">
        <template v-if="roleSelect">
            <label for="role">Select Role:</label>
            <input class="input" id="role" v-model="data.role" maxLength="20" placeholder="Crewmember" />
        </template>
        <label for="citizen">Select Citizen:</label>
        <forms-input-citizen @selected="selected" />
        <input type="submit" :class="canSubmit" value="Add" />
    </form>
</template>

<script setup>
const { $api } = useNuxtApp()
const emit = defineEmits(['add'])

const props = defineProps({
    roleSelect: {
        type: Boolean,
        default: true
    }
})

const data = ref({
    role: '',
    handle: ''
})

const role = ref("")
const handle = ref("")

const canSubmit = computed({
    get() {
        if (data.value.handle.length > 0) {
            return "active"
        } else {
            return "deactivated"
        }
    }
})

const selected = (citizen) => {
    data.value.handle = citizen.handle
}

const addCrew = () => {
    if(data.value.handle) {
        const crew = {
            handle: data.value.handle,
            role: data.value.role || "Crewmember"
        }
        emit('add', crew) 
    }        
}
</script>

<style scoped>
.crew-form {
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
<template>
    <form @submit.prevent="submit" class="fleet-form">
        <label for="name">Group Name:</label>
        <div>
            <input class="input" type="text" id="name" v-model="data.name" maxlength="16">
            <span v-if="error.name != ''" class="error">{{ error.name }}</span>
        </div>
        <label for="purpose">Purpose:</label>
        <input class="input" type="text" id="purpose" v-model="data.purpose">
        <template v-if="!group">
            <label for="commander">Commander (optional):</label>
            <forms-input-citizen @selected="selected" />
        </template>
        <input type="submit" value="Submit" />
    </form>
</template>

<script setup>
const emit = defineEmits(['submit'])
const props = defineProps({
    group: {
        type: Object,
        default: function () {
            return null
        }
    }
})

const data = ref({
    name: '',
    purpose: '',
    cmdr: ''
})

const error = ref({
    name: ''
})

const selected = (citizen) => {
    data.value.cmdr = citizen.handle
}

const submit = async () => {
    // do checks then emit things
    if (data.value.name === '') {
        error.value.name = '* A name is required!'
        return
    }

    emit('submit', data.value)
}
</script>

<style scoped>
.fleet-form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 15px;
}

.error {
    color: red;
}

input {
    margin: 5px 0;
}

.results {
    max-height: 70vh;
    overflow: auto;
}

.result {
    width: 100%;
    margin: 2px 0;
}

.result.selected {
    border: 1px solid green;
    background: rgba(0,255,55,0.1)
}

input.active {
    cursor: pointer;
}

input.deactivated {
    cursor: not-allowed;
    opacity: 0.2;
}
</style>
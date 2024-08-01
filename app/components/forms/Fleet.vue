<template>
    <form @submit.prevent="submit" class="fleet-form">
        <label for="name">Fleet Name:</label>
        <div>
            <input class="input" type="text" id="name" v-model="name" maxlength="16">
            <span v-if="error.name != ''" class="error">{{ error.name }}</span>
        </div>
        <label for="purpose">Purpose:</label>
        <input class="input" type="text" id="purpose" v-model="purpose">
        <template v-if="!group">
            <label for="commander">Commander (optional):</label>
            <input 
                class="input" 
                id="commander" 
                @keyup.enter="getResults()" 
                @input="autoGetResults()" 
                v-model="search" 
                placeholder="Citizen Search" />
            <div v-if="result" class="results">
                <citizen-card v-for="res in result.data" :key="res.handle" :citizen="res" :class="resultClass(res)" @selected="selected"/>
            </div>
        </template>
        <input type="submit" value="Submit" />
    </form>
</template>

<script setup>
const { $api } = useNuxtApp()

const props = defineProps({
    group: {
        type: Object,
        default: function () {
            return null
        }
    }
})

const pending = ref(false)
const result = ref('')

const name = ref('')
const purpose = ref('')
const search = ref('')
const cmdr = ref('')
const error = ref({
    name: ''
})

const selected = (citizen) => {
    cmdr.value = citizen.handle
}

const submit = async () => {
    // do checks then emit things
    if (name.value === '') {
        error.value.name = '* A name is required!'
        return
    }

    if (props.group) {
        await updateFleet()
    } else {
        await addFleet()
    }
}

const updateFleet = async () => {

}

const addFleet = async () => {

}

const autoGetResults = async () => {
    if(search.value.length >= 3) {
        await getResults()
    } else {
        result.value = null
    }
}

const getResults = async () => {
    pending.value = true
    result.value = await searchCitizen(search.value)
    pending.value = false
}

const searchCitizen = async (search) => {
    const result = await $api(`/api/search/citizen`, {
        method: 'POST',
        body: {
            text: search
        }
    })
    return result
}

const resultClass = (res) => {
    if (res.handle === cmdr.value) {
        return "result selected"
    } else {
        return "result"
    }
}
</script>

<style scoped>
.fleet-form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 15px;
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
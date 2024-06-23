<template>
    <form @submit.prevent="addCrew()" class="crew-form">
        <template v-if="roleSelect">
            <label for="role">Select Role:</label>
            <input class="input" id="role" v-model="role" maxLength="20" placeholder="Crewmember" />
        </template>
        <label for="citizen">Select Citizen:</label>
        <input class="input" 
                id="citizen" 
                @keyup.enter="getResults()" 
                @input="autoGetResults()" 
                v-model="search" 
                placeholder="Citizen Search" />
        <div v-if="result" class="results">
            <citizen-card v-for="res in result" :key="res.handle" :citizen="res" :class="resultClass(res)" @selected="selected"/>
        </div>
        <input type="submit" :class="canSubmit" value="Add" />
    </form>
</template>

<script setup>
const emit = defineEmits(['add'])

const props = defineProps({
    roleSelect: {
        type: Boolean,
        default: true
    }
})

const search = ref("")
const result = ref(null)
const pending = ref(false)

const role = ref("")
const handle = ref("")

const resultClass = (res) => {
    console.log(res)
    if (res.handle === handle.value) {
        return "result selected"
    } else {
        return "result"
    }
}

const canSubmit = computed({
    get() {
        if (handle.value.length > 0) {
            return "active"
        } else {
            return "deactivated"
        }
    }
})

const selected = (citizen) => {
    handle.value = citizen.handle
}

const addCrew = () => {
    if(handle.value) {
        const crew = {
            handle: handle.value,
            role: role.value || "Crewmember"
        }
        console.log("emitting: ", crew)
        emit('add', crew) 
    }        
}

async function autoGetResults() {
    if(search.value.length >= 3) {
        pending.value = true
        result.value = await searchCitizen(search.value)
        console.log(result)
        pending.value = false
    } else {
        result.value = null
    }
}

async function getResults() {
    const data = {
        text: input.value
    }
    result.value = await $fetch(`/api/search/citizen`, {
        method: 'POST',
        body: data,
        onResponse(_ctx) {
            pending.value = false
        }
    })
}
</script>

<style scoped>
.crew-form {
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
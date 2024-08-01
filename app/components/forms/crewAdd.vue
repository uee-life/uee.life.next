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
            <citizen-card v-for="res in result.data" :key="res.handle" :citizen="res" :class="resultClass(res)" @selected="selected"/>
        </div>
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

const search = ref("")
const result = ref(null)
const pending = ref(false)

const role = ref("")
const handle = ref("")

const resultClass = (res) => {
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
        emit('add', crew) 
    }        
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
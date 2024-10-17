<template>
    <div class="citizen-picker">
        Citizen:
        <input class="input" 
                id="citizen" 
                @keyup.enter="getResults()" 
                @input="autoGetResults()" 
                v-model="search" 
                placeholder="Citizen Search" />
        <div v-if="result" class="results">
            <citizen-card v-for="res in result.data" :key="res.handle" :citizen="res" :class="resultClass(res)" @selected="selected"/>
        </div>
    </div>
</template>

<script setup>
    const { $api } = useNuxtApp()

    const emit = defineEmits(['selected'])

    const search = ref("")
    const result = ref(null)
    const handle = ref(null)

    const autoGetResults = async () => {
        if(search.value.length >= 3) {
            await getResults()
        } else {
            result.value = null
        }
    }

    const getResults = async () => {
        result.value = await $api(`/api/search/citizen`, {
            method: 'POST',
            body: {
                text: search.value
            }
        })
    }

    const selected = (citizen) => {
        handle.value = citizen.handle
        emit('selected', citizen)
    }

    const resultClass = (res) => {
        if (res.handle === handle.value) {
            return "result selected"
        } else {
            return "result"
        }
    }
</script>

<style scoped>
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
</style>
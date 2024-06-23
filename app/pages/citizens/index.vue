<template>
    <div class='citizen-search'>
        <client-only>
            <teleport to="#left-dock">
                <panel-dock title="find citizen" class="search-box">
                    <input class="search-input" @keyup.enter="getResults()" @input="autoGetResults()" v-model="input" placeholder="Citizen Handle"/>
                </panel-dock>
            </teleport>
        </client-only>
        <div v-if="result && result.length" class="results">
            <citizen-card v-for="res in result" :key="res.handle" :citizen="res" class="result" @selected="selected"/>
        </div>
        <widgets-no-result v-else :text="noResultText"/>
    </div>
</template>

<script setup>
const result = ref(null)
const input = ref("")
const pending = ref(false)

const noResultText = computed({
    get() {
        if (input.value.length >=3) {
            if(pending.value) {
                return "Searching..."
            } else {
                return "No Results"
            }
        } else {
            return "Search Citizens"
        }
    }
})

async function autoGetResults() {
    if(input.value.length >= 3) {
        pending.value = true
        getResults()
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

function selected(citizen) {
    navigateTo(`/citizens/${citizen.handle}`)
}
</script>

<style scoped>
    .citizen-search {
        position: relative;
        width: 100%;
        padding-top: 14px;
    }

    .search-box .search-input {
        margin: 5px;
        width: calc(100% - 10px);
        box-sizing: border-box;
    }

    .results {
        position: relative;
        display: flex;
        flex-wrap: wrap;
    }
    .result {
        display: flex;
        flex-grow: 1;
        margin: 5px;
    }

    .result>a {
        display: flex;
        box-sizing: border-box;
        height: 100%;
        align-items: center;
        background: url('@/assets/fading-bars.png') repeat;
        padding: 5px 10px;
        position: relative;
        height: fit-content;
        border: 1px solid #546f84;
        flex-grow: 1;
    }
</style>
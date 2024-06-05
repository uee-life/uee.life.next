<template>
<client-only>
    <div class='citizen-results'>
        <teleport to="#left-dock">
            <panel-dock title="find citizen" class="search-box">
                <input class="search-input" @keyup.enter="getResults()" @input="autoGetResults()" v-model="input" placeholder="Citizen Handle"/>
            </panel-dock>
        </teleport>
        <div v-if="result" class="results">
            <citizen-card v-for="res in result" :key="res.handle" :citizen="res" class="result">

            </citizen-card>
        </div>
        <widgets-no-result v-else />
    </div>
</client-only>
</template>

<script setup>
const result = ref(null)
const input = ref("")

async function autoGetResults() {
    console.log('autogetresult: ' + input.value)
    if(input.value.length >= 3) {
        getResults()
    } else {
        result.value = null
    }
}

async function getResults() {
    const data = {
        text: input.value
    }
    console.log("data: ", data)
    result.value = await $fetch(`/api/search/citizen`, {
        method: 'POST',
        body: data
    })
}

function citizenLink(handle) {
    return `/citizens/${handle}`;
}
</script>

<style scoped>
    .citizen-results {
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
        background: url('/images/fading-bars.png') repeat;
        padding: 5px 10px;
        position: relative;
        height: fit-content;
        border: 1px solid #546f84;
        flex-grow: 1;
    }

    .result>a>.thumb {
        display: inline-block;
        width: 70px;
        height: 70px;
        position: relative;
    }

    .result>a>.thumb>img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        align-self: center;
    }

    .result>a>.identity {
        display: flex;
        line-height: 16px;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
    }

    .result>a>.identity>.org {
        font-size: 0.9rem;
        color: #739cb0;
        margin-top: 2px;
    }

    .result>a>.identity>.symbol {
        font-size: 0.9rem;
        color: #739cb0;
        margin-top: 2px;
    }

    .result>a>.right {
        display: none;
    }

    .no-decor {
        text-decoration: none;
    }

</style>
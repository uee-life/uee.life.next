<template>
<ClientOnly>
    <div class="search-main">
        <teleport to="#left-dock">
        <panel-dock title="find orgs" class="search-box">
            <input class="search-input" @keyup.enter="getResults()" @input="autoGetResults()" v-model="input" placeholder="Org Handle"/>
        </panel-dock>
        </teleport>
        <div v-if="result" v-html="result" class="results"></div>
        <div v-else class="no-results">
        <span class="text big">
            No Results
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </span>
    </div>
    </div>
</ClientOnly> 
 </template>

<script setup>

const result = ref("")
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
        search: input.value
    }
    console.log("data: ", data)
    await $fetch(`/api/search/org`, {
        method: 'POST',
        body: data,
        onResponse(_ctx) {
            result.value = _ctx.response._data.html
                                .replace(/\/media/g, 'https://robertsspaceindustries.com/media')
                                .replace(/\/rsi/g, 'https://robertsspaceindustries.com/rsi')
        }
    })
}
</script>

<style>
    .search-main {
        position: relative;
        width: 100%;
        padding-top: 14px;
    }

    .no-results {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .no-results>.text {
        position: relative;
        width: fit-content;
        padding-left: 20px;
        padding-right: 20px;
        margin: 20px;
    }

    .no-results>.text.big {
        font-family: 'Michroma';
        font-size: 25px;
    }

    .search-box .search-input {
        margin: 5px;
        width: calc(100% - 10px);
        box-sizing: border-box;
    }

    .search-box .search-button {
        margin: 5px;
    }
    .results {
        position: relative;
        display: flex;
        flex-wrap: wrap;
    }
    .org-cell {
        display: flex;
        flex-grow: 1;
        margin: 5px;
    }

    .org-cell>a {
        display: flex;
        align-items: center;
        background: url('/images/fading-bars.png') repeat;
        padding: 5px 10px;
        position: relative;
        height: fit-content;
        border: 1px solid #546f84;
        flex-grow: 1;
    }

    .org-cell>a>.left {
        display: flex;
    }

    .org-cell>a>.left>.thumb {
        display: inline-block;
        width: 70px;
        height: 70px;
        position: relative;
    }

    .org-cell>a>.left>.thumb>img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .org-cell>a>.left>.identity {
        display: flex;
        line-height: 16px;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
    }

    .org-cell>a>.left>.identity>.symbol {
        font-size: 0.9rem;
        color: #739cb0;
    }

    .org-cell>a>.right {
        display: none;
    }
</style>
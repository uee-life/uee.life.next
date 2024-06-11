<template>
    <div class="org-search">
        <ClientOnly>
            <teleport to="#left-dock">
            <panel-dock title="find orgs" class="search-box">
                <input class="search-input" @keyup.enter="getResults()" @input="autoGetResults()" v-model="input" placeholder="Org Handle"/>
            </panel-dock>
            </teleport>
        </ClientOnly>
        <div v-if="result" v-html="result" class="results"></div>
        <widgets-no-result v-else :text="noResultText"/>
    </div> 
 </template>

<script setup>

const result = ref("")
const input = ref("")
const pending = ref(false)

const noResultText = computed({
    get() {
        if (input.value.length >= 3) {
            if(pending.value) {
                return "Searching..."
            } else {
                return "No Results"
            }
        } else {
            return "Search Orgs"
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
        search: input.value
    }
    await $fetch(`/api/search/org`, {
        method: 'POST',
        body: data,
        onResponse(_ctx) {
            if(_ctx.response._data) {
                result.value = _ctx.response._data.html
                                .replace(/\/media/g, 'https://robertsspaceindustries.com/media')
                                .replace(/\/rsi/g, 'https://robertsspaceindustries.com/rsi')
            }
            pending.value = false
        }
    })
}
</script>

<style>
    .org-search {
        position: relative;
        width: 100%;
        padding-top: 14px;
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
        background: url('@/assets/fading-bars.png') repeat;
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
<template>
    <widgets-loading v-if="status != 'success'"/>
    <div v-else class="system-list">
      <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" href="https://robertsspaceindustries.com/starmap">Open Starmap</a></div>
                </panel-dock>
                <panel-dock title="find location" class="search-box">
                    <input class="search-input" @keyup.enter="getResults()" @input="autoGetResults()" v-model="input" placeholder="Location Name"/>
                </panel-dock>
            </teleport>
        </client-only>
        <explore-location-summary v-if="result" v-for="sys in result.data" :link="`/explore/${sys.code}`" :loc="{thumbnail: systemImage(sys.image_url), name: sys.name}">
            <div><span class="data">{{ systemType(sys) }}</span></div>
            <img class="icon" v-if="sys.affiliation != 'None'" :src="`/images/factions/icon-${sys.affiliation}.png`"/>
        </explore-location-summary>
        <explore-location-summary v-else v-for="sys in systems.data" :link="`/explore/${sys.code}`" :loc="{thumbnail: systemImage(sys.image_url), name: sys.name}">
            <img class="icon" v-if="sys.affiliation != 'None'" :src="`/images/factions/icon-${sys.affiliation}.png`"/>
        </explore-location-summary>
    </div>
</template>
  
<script setup>
const {$api} = useNuxtApp()
const {data: systems, status} = useAPI(`/api/explore/systems`)

const result = ref(null)
const input = ref("")


async function autoGetResults() {
    if(input.value.length >= 3) {
//        pending.value = true
        getResults()
    } else {
        result.value = null
    }
}

async function getResults() {
    const data = {
        search: input.value
    }
    result.value = await $api(`/api/search/location`, {
        method: 'POST',
        body: data,
        onResponse(_ctx) {
//            pending.value = false
        }
    })
    console.log(result)
}

function systemImage(img) {
    if(img) {
      return img
    } else {
      return "/images/default/system.jpg"
    }
}

function systemType(sys) {
    if(sys.type == "BINARY") {
        return "Binary Star System"
    } else if (sys.type == "SYSTEM") {
        return "Star System"
    } else {
      return sys.type
    }
}
</script>

<style>
.layout-enter-active,
.layout-leave-active {
    transition-property: opacity;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;
}
.layout-enter,
.layout-leave-to {
    opacity: 0;
}

.system-list {
    display: flex;
    flex-wrap: wrap;
    flex-basis: fit-content;
    margin-left: -5px;
    margin-right: -5px;
    margin-top: 15px;
}

.data {
    color: #dbf3ff;
}

.icon {
  position: absolute;
  width: 30px;
  right: 5px;
  bottom: 5px;
}
</style>
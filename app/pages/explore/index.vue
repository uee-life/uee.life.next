<template>
    <widgets-loading v-if="pending"/>
    <div v-else class="system-list">
      <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" href="https://robertsspaceindustries.com/starmap">Open Starmap</a></div>
                </panel-dock>
            </teleport>
        </client-only>
        <explore-location-summary v-for="sys in systems" :link="`/explore/${sys.code}`" :loc="{thumbnail: systemImage(sys.image_url), name: sys.name}">
            <div><span class="data">{{ systemType(sys) }}</span></div>
            <img class="icon" :src="`/images/factions/icon-${sys.affiliation}.png`"/>
        </explore-location-summary>
    </div>
</template>
  
<script setup>
const systems = ref([])

const {pending} = await useFetch(`/api/explore/systems`, {
key: 'getSystems',
server: false,
lazy: true,
async onResponse(_ctx) {
    console.log(_ctx.response._data)
    systems.value = _ctx.response._data
}
})

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
  } else {
    return "Star System"
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
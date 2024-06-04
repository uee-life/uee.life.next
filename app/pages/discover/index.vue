<template>
    <widgets-loading v-if="pending"/>
    <div v-else class="system-list">
        <explorer-location-summary v-for="sys in systems" :link="`/discover/${sys.code}`" :loc="{thumbnail: systemImage(sys.image_url), name: sys.name}">
            <div>Type: <span class="data">{{ systemType(sys) }}</span></div>
        </explorer-location-summary>
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
      return "/images/systems/default.jpg"
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
</style>
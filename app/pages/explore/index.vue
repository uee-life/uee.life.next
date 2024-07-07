<template>
    <widgets-loading v-if="status != 'success'"/>
    <div v-else class="system-list">
      <client-only>
            <teleport to="#left-dock">
                <panel-dock title="nav">
                    <div class="left-nav-button"><a target="_blank" href="https://robertsspaceindustries.com/starmap">Open Starmap</a></div>
                </panel-dock>
            </teleport>
        </client-only>
        <explore-location-summary v-for="sys in systems.data" :link="`/explore/${sys.code}`" :loc="{thumbnail: systemImage(sys.image_url), name: sys.name}">
            <div><span class="data">{{ systemType(sys) }}</span></div>
            <img class="icon" :src="`/images/factions/icon-${sys.affiliation}.png`"/>
        </explore-location-summary>
    </div>
</template>
  
<script setup>
const {data: systems, status} = await useAPI(`/api/explore/systems`)

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
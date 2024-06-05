<template>
    <panel-dock :title="affiliate ? 'Affiliation' : org.model" class="citizen-org">
        <div class="content">
          <nuxt-link :to="orgLink" class="org-link"><img class="logo" :src="org.logo" /></nuxt-link>
          <div class="org-name">
            {{ org.name }}
          </div>
          <div class="org-title">
            Title: {{ org.rank.title }}
          </div>
        </div>
    </panel-dock>
</template>
  
<script setup>
import { gsap } from "gsap"

const props = defineProps({
org: {
    type: Object,
    required: true
},
affiliate: {
  type: Boolean,
  default: false
}
})

//todo: make this a generic logo
const logo = ref("https://robertsspaceindustries.com/media/2weountodg09pr/heap_infobox/MCBANE-Logo.png")

const orgLink = computed({
    get() {
        return `/orgs/${props.org.tag}`
    }
})
</script>
  
<style>
.citizen-org {
  position: relative;
  height: 'auto';
  display: block;
  margin-bottom: 20px;
}
.citizen-org .content{
  display: flex;
  flex-direction: Column;
  justify-content: center;
  opacity: 1;
}
.citizen-org .logo {
  width: 165px;
  height: 165px; 
  align-self: center;
  margin: 10px;
}
.citizen-org .org-name {
  align-self: center;
  text-align: center;
  font-weight: bold;
  color: #dbf3ff;
}
.citizen-org .org-title {
  align-self: center;
  margin-bottom: 15px;
  text-align: center;
  color: #dbf3ff;
}

.org-link {
  display: flex;
  justify-content: center;
}
</style>
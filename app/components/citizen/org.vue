<template>
    <panel-dock :title="affiliate ? 'Affiliation' : org.model" class="citizen-org">
        <nuxt-link :to="orgLink" class="org-link">
          <img class="logo" :src="orgLogo" />
        </nuxt-link>
        <div class="org-name">
          {{ org.name }}
        </div>
        <div class="org-title">
          Title: {{ org.rank.title }}
        </div>
    </panel-dock>
</template>
  
<script setup>
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
const orgLogo = computed({
  get() {
    if(props.org.logo) {
      return props.org.logo
    } else {
      return "/images/default/org.jpg"
    }
  }
})

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
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
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
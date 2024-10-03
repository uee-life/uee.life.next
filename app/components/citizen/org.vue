<template>
    <panel-dock class="citizen-org" :title="affiliate ? 'Affiliation' : orgModel" title-size="small">
        <nuxt-link class="org-link" :to="orgLink">
          <img class="logo" :src="orgLogo" />
        </nuxt-link>
        <div class="org-name">
          {{ org.name }}
        </div>
        <div v-if="org.rank" class="org-title">
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
  },
  title: {
    type: String,
    default: ''
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
        return `/orgs/${props.org.id}`
    }
})

const orgModel = computed({
  get() {
    if (props.title) {
      return props.title
    } else if (props.org.model) {
      return props.org.model
    } else {
      return 'Organization'
    }
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
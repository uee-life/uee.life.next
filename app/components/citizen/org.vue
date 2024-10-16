<template>
    <div class="citizen-org" :title="affiliate ? 'Affiliation' : orgModel" title-size="small">
        <nuxt-link class="org-link" :to="orgLink">
          <img :src="orgLogo" :class="logoSize"/>
        </nuxt-link>
        <div :class="nameSize">
          {{ org.name }}
        </div>
        <div v-if="org.rank" class="org-title">
          Title: {{ org.rank.title }}
        </div>
    </div>
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
  },
  size: {
    type: String,
    default: 'large',
    validator: function (value) {
      return ['small', 'medium', 'large'].indexOf(value) !== -1
    }
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

const logoSize = computed({
  get() {
    return `logo ${props.size}`
  }
})

const nameSize = computed({
    get() {
        return `org-name ${props.size}`
    }
})
</script>
  
<style>

.citizen-org .log {
  align-self: center;
}
.logo.large {
  width: 165px;
  height: 165px; 
  margin: 10px;
}

.logo.medium {
  width: 135px;
  height: 135px; 
  margin: 10px;
}

.logo.small {
  width: 95px;
  height: 95px; 
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

.org-name.medium {
    font-size: 12px;
}

.org-name.small {
    font-size: 11px;
}

.org-link {
  display: flex;
  justify-content: center;
}
</style>
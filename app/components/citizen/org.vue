<template>
    <panel-dock :title="citizen.org.model" class="citizen-org">
        <div class="content">
          <nuxt-link :to="orgLink" class="org-link"><img class="logo" :src="citizen.org.logo" /></nuxt-link>
          <div class="org-name">
            {{ citizen.org.name }}
          </div>
          <div class="org-title">
            Title: {{ citizen.info.orgTitle }}
          </div>
        </div>
    </panel-dock>
</template>
  
<script setup>
import { gsap } from "gsap"

const props = defineProps({
citizen: {
    type: Object,
    required: true
}
})

//todo: make this a generic logo
const logo = ref("https://robertsspaceindustries.com/media/2weountodg09pr/heap_infobox/MCBANE-Logo.png")

const orgLink = computed({
    get() {
        return `/orgs/${props.citizen.org.tag}`
    }
})
  
//TODO: re-add transitions
/*  export default {
    computed: {
      orgLink () {
        return `/orgs/${this.citizen.org.tag}`;
      }
    },
    watch: {
      'citizen.org': {
        handler: function() {
          if(Object.keys(this.citizen.org).length === 0) {
            const tl = gsap.timeline()
            tl.to(".citizen-org .content", {duration: 0.5, opacity: 0})
            tl.to(".citizen-org", {duration: 1, opacity: "0"})
            tl.to(".citizen-org", {display: "none"})
          } else {
            const tl = gsap.timeline()
            tl.to(".citizen-org", {display: "block"})
            tl.to(".citizen-org", {duration: 0.6, opacity: 1})
            tl.to(".citizen-org .content", {duration: 1, opacity: 1})
          }
        }
      }
    },
    mounted() {
        if(Object.keys(this.citizen.org).length === 0) {
            gsap.to(".citizen-org .content", {duration: 0.5, opacity: 0})
            gsap.to(".citizen-org", {duration: 1, height: "50px"})
            gsap.to(".citizen-org", {delay: 1, display: "none"})
        } else {
            gsap.to(".citizen-org", {display: "block"})
            gsap.fromTo(".citizen-org", {height: "50px"}, {duration: 0.6, height: "auto"})
            gsap.to(".citizen-org .content", {duration: 1, delay: 0.6, opacity: 1})
        }
    }
  }*/
  </script>
  
  <style>
    .citizen-org {
      position: relative;
      height: 50px;
      display: none;
      margin-bottom: 20px;
    }
    .citizen-org .content{
      display: flex;
      flex-direction: Column;
      justify-content: center;
      opacity: 0;
    }
    .citizen-org .logo {
      width: 165px;
      height: 165px; 
      align-self: center;
      margin: 10px;
    }
    .citizen-org .org-name {
      align-self: center;
      font-size: 20px;
      text-align: center;
    }
    .citizen-org .org-title {
      align-self: center;
      margin-bottom: 15px;
      text-align: center;
    }
  
    .org-link {
      display: flex;
      justify-content: center;
    }
  </style>
<template>
    <div class="org-banner">
      <div class="banner-img" :style="bannerImage"></div>
      <div class="mask">
        <div class="org-banner-bottom">
          <div class="org-logo" id="org-logo">
            <img :src="org.logo" />
          </div>
          <div class="org-summary">
              <h1>{{org.name}} /  <span class="tag"><slot name="tag">{{ tag }}</slot></span></h1>
              <slot><div class="org-model">{{org.model}}</div></slot>
          </div>
        </div>
      </div>
      <span class="corner top left"></span>
      <span class="corner top right"></span>
      <span class="corner bottom left"></span>
      <span class="corner bottom right"></span>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
    org: {
        type: Object
    }
})

const bannerImage = computed({
    get() {
        return `background: url("${props.org.banner}") top center / cover`
    }
})

const tag = computed({
    get() {
        if(props.org.tag){
            return props.org.tag.toUpperCase()
        } else {
            return props.org.tag
        }
    }
})

onMounted(() => {
    gsap.to(".org-banner", {duration: 0.5, opacity: 1})
    gsap.to(".org-logo", {duration: 1, opacity: 1})
    gsap.to(".org-logo img", {duration: 1, opacity: 1})
    gsap.to(".org-banner h1", {duration: 1, opacity: 1})  
})

/*export default {
  name: 'org-banner',
  props: ["org"],
  computed: {
    style () {
      return 'background: url("' + this.org.banner + '") center center / cover'
    },
    tag () {
      if(this.org.tag){
        return this.org.tag.toUpperCase()
      } else {
        return this.org.tag
      }
    }
  },
  mounted() {
      gsap.to(".org-banner", {duration: 0.5, opacity: 1})
        gsap.to(".org-logo", {duration: 1, opacity: 1})
        gsap.to(".org-logo img", {duration: 1, opacity: 1})
        gsap.to(".org-banner h1", {duration: 1, opacity: 1})   
  }
}*/
</script>

<style>

    .org-banner {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: calc(100vw - 20px);
      border: 1px solid #546f84;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      margin-bottom: 10px;
      margin-top: 20px;
      overflow: hidden;
      opacity: 0;
    }

    .org-banner .mask {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: url('/images/fading-bars.png') repeat;
        z-index: 0;
        padding-top: 0.1px;
    }

    .org-banner .banner-img {
      position: absolute;
      width: 100%;
      height: 250px;
      opacity: 0.8 !important;
      border-bottom: 1px dashed #546f84;
      display: block;
      background-size: cover;
      background-position: center center;
      z-index: -1;
    }

    .org-logo{
        width: 136px;
        height: 136px;
        margin-right: 20px;
        opacity: 0;
    }

    .org-banner-bottom {
      bottom: 0;
      left: 0;
      padding: 5px;
      margin-top: 177px;
      display: flex;
    }

    .org-banner h1 {
      height: fit-content;
      opacity: 0;
      font-family: 'Michroma';
      letter-spacing: 1px;
      color: #dbf3ff;
      margin: 0;
    }

    .org-banner h1 .tag {
        color: #fff000;
        text-transform: uppercase;
    }

    .org-logo img {
        width: 136px;
        height: 136px;
        opacity: 0;
        margin-left: 5px;
    }

    .org-summary {
      padding-top: 73px;
    }
    
    .org-summary .org-model::before {
      content: "[ "
    }

    .org-summary .org-model::after {
      content: " ]"
    }
</style>
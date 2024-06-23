<template>
    <div class="panel">
        <panel-title class="panel-title" v-if="title" :text="title" :size="titleSize" />
        <div class="panel-content">
            <slot></slot>
        </div>
        <span class="corner top left"></span>
        <span class="corner top right"></span>
        <span class="corner bottom left"></span>
        <span class="corner bottom right"></span>
    </div>
</template>

<script setup>
import { gsap } from 'gsap';

const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    titleSize: {
        type: String,
        default: "medium",
        validator(value, props) {
            return ['small', 'medium', 'large'].includes(value)
        }
    }
})

onMounted(() => {
    nextTick(() => {
        const tl = gsap.timeline()
        tl.to('.panel', {duration: 0.5, opacity: 1})
        tl.to('.panel', {duration: 0.8, "max-width": "100vw", ease: "power2.in"})
        tl.to('.panel', {delay: -0.5, duration: 0.8, "max-height": '9000px', ease: "power2.in"})
        if(props.title){
            tl.to('.panel-title', {delay: -0.6, duration: 0.5, opacity: 1})
        }
        tl.to('.panel-content', {duration: 0.5, opacity: 1})
    })
})
</script>

<style scoped>
    .panel {
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        background: url('@/assets/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        font-size: calc(13px + (15 - 13) * ((100vw - 300px) / (1600 - 200)));
        opacity: 0;
        min-width: 50px;
        min-height: 50px;
        max-width: 50px;
        max-height: 50px;
        margin-bottom: 20px;
    }

    .panel-title {
        opacity: 0;
    }

    .panel-content {
        opacity: 0;
        display: flex;
    }

    strong {
        color: #dbf3ff !important;
    }
</style>
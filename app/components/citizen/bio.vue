<template>
    <panel-main class="citizen-bio" title="bio" titleSize="small">
        <div class="content">{{bio}}</div>
    </panel-main>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
    bio: {
        type: String
    }
})

onMounted(() => {
    nextTick(() => {
        gsap.to(".citizen-bio", {duration: 1, opacity: 1})
        gsap.to(".citizen-bio", 0.6, {width:"100%"})
        gsap.to(".citizen-bio .content", {duration: 0.6, width: "100%", height: "fit-content"})
        gsap.to(".citizen-bio .content", {delay: 1, duration: 1, opacity: 1}) 
    })
})
</script>

<style>
    .citizen-bio {
        display: block;
        box-sizing: border-box;
        position: relative;
        min-width: 105px;
        min-height: 50px;
        width: fit-content;
        height: fit-content;
        border-top: none;
        padding: 10px;
        margin-bottom: 20px;
        opacity: 0;
    }

    .citizen-bio .content {
        display: flex;
        justify-content: flex-start;
        position: relative;
        height: 50px;
        min-height: 50px;
        width: 105px;
        max-width: calc(100vw - 50px);
        opacity: 0;
        overflow: auto;
        align-self: flex-start;
    }

    /* width */
    ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
    background: #dbf3ff; 
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
    background: #546f84; 
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
    background: #39ced8; 
    }
</style>
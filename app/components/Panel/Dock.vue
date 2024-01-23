<template>
    <div :class="divClass">
        <panel-title v-if="title" :text="title" />
        <div :id="type" :class="type"><slot /></div>
        <span class="corner top left"></span>
        <span class="corner top right"></span>
        <span class="corner bottom left"></span>
        <span class="corner bottom right"></span>
    </div>
</template>

<script setup>
import Gsap from 'gsap';

const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    type: {
        type: String
    }
})

const divClass = computed({
    get() {
        return 'dock-item'
    }
})

onMounted(() => {
    Gsap.to('.dock-item', {delay: 0.5, duration: 1, opacity: 1})
})
</script>

<style>
    .dock-item {
        position: relative;
        box-sizing: border-box;
        height: fit-content;
        width: 240px;
        min-width: 240px;
        margin: 10px;
        margin-top: 20px;
        padding: 15px 10px;
        background: url('/images/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        opacity: 0;
    }
    .dock-item.mobile {
        width: calc(100% - 5px)
    }
</style>
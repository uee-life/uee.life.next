<template>
    <div class="main-panel" @click="$emit('click')">
        <panel-title v-if="title" :text="title" :size="titleSize" />
        <slot></slot>
        <span class="corner top left"></span>
        <span class="corner top right"></span>
        <span class="corner bottom left"></span>
        <span class="corner bottom right"></span>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: ""
    },
    titleSize: {
        type: String,
        default: "medium"
    }
})
</script>

<style>
    .main-panel {
        position: relative;
        box-sizing: border-box;
        flex-grow: 1;
        padding: 10px 20px;
        margin: 20px 0;
        min-width: 240px;
        max-width: calc(100vw - 25px);
        background: url('/images/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        font-size: calc(13px + (15 - 13) * ((100vw - 300px) / (1600 - 200)));
    }
</style>
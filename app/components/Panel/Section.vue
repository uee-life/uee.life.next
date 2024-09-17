<template>
    <panel class="section"
        :title="title"
        :title-Size="titleSize"
        :centered="centered">
            <slot></slot>
    </panel>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    titleSize: {
        type: String,
        default: "no-title",
        validator(value, props) {
            return ['no-title', 'small', 'medium', 'large'].includes(value)
        }
    },
    centered: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
    .section {
        display: flex;
        flex-direction: column;
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        background: none;
        border: 1px dashed rgba(84, 111, 132, 0.4);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>
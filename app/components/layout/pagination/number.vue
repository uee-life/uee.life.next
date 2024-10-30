<template>
    <span :class="pageClass" @click="onClick">
        {{ pageNumber }}
    </span>
  </template>

<script setup>
const emit = defineEmits(['loadPage'])
const props = defineProps({
    pageNumber: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        required: true
    }
})

const pageClass = computed({
    get() {
        if(props.pageNumber === props.currentPage) {
            return "page-number selected"
        } else {
            return "page-number"
        }
    }
})

function onClick() {
    emit("loadPage", props.pageNumber)
}
</script>

<style>
    .page-number {
        color: #dbf3ff;
        cursor: pointer;
        margin: 0 3px;
    }

    .page-number.selected {
        color: #39ced8;
        cursor: initial;
    }
</style>
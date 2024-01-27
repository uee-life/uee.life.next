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
    console.log("emitting loadPage")
    emit("loadPage", props.pageNumber)
}
/*export default {
    props: {
        pageNumber: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        }
    },
    methods: {
        onClick() {
            this.$emit("loadPage", this.pageNumber)
        }
    },
    computed: {
        pageClass() {
            if(this.pageNumber === this.currentPage) {
                return "page-number selected"
            } else {
                return "page-number"
            }
        }
    }
}*/
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
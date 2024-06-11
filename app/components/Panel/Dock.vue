<template>
    <panel :class="divClass" :title="title" titleSize="small">
        <div :id="type" :class="type">
            <slot></slot>
        </div>
    </panel>
</template>

<script setup>
const { $viewport } = useNuxtApp()

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
        if ($viewport.isLessThan('tablet')) {
            return 'dock-item mobile'
        } else {
            return 'dock-item'
        }
    }
})
</script>

<style>
    .dock-item {
        width: 240px;
        min-width: 240px;
        margin: 10px;
    }
    .dock-item.mobile {
        width: calc(100vw - 37px);
    }
</style>
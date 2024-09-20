<template>
    <ClientOnly>
        <teleport :to="`#banner-${display}`">
            <panel-banner :class="`banner ${display}`"
                :name="name"
                :tag="tag"
                :type="type"
                :image="image"
                :logo="logo"
                @clicked="$emit('clicked')">
                <template v-slot:logo>
                    <slot name="logoslot"></slot>
                </template>
            </panel-banner>
        </teleport>
    </ClientOnly>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    display: {
        type: String,
        default: 'content'
    }
})
</script>

<style scoped>
</style>
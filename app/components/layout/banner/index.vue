<template>
    <ClientOnly>
        <teleport :to="`#banner-${display}`">
            <panel-banner :class="bannerClass"
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
const { $viewport } = useNuxtApp()

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

const bannerClass = computed({
    get() {
        if ($viewport.isLessThan('tablet')) {
            return `banner mobile ${props.display}`
        } else {
            return `banner ${props.display}`
        }
    }
})
</script>

<style scoped>
</style>
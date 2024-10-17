<script setup>
const { $viewport } = useNuxtApp()
import { gsap } from "gsap"

const props = defineProps({
    citizen: {
        type: Object
    },
    isOwner: {
        type: Boolean
    }
})

const componentClass = computed({
    get() {
        if($viewport.isLessThan('tablet')) {
            return 'citizen-info mobile'
        } else {
            return 'citizen-info'
        }
    }
})

onMounted(() => {
    nextTick(() => {
        gsap.to(".citizen-info .info", {delay: 2, duration: 0.5, opacity: 1})
    })
})
</script>

<template>
    <div id="citizen-info" :class="componentClass">
        <panel id="portrait">
            <citizen-portrait :citizen="citizen" />
        </panel>
        <div class="info">
            <client-only>
            <layout-info :items='{
                    "UEE Record": citizen.record,
                    "Name": citizen.name,
                    "Handle": citizen.handle,
                    "Enlisted": citizen.enlisted
                    }'/>
            </client-only>
        </div>
  </div>
</template>

<style scoped>
    .citizen-info {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: fit-content;
        margin-top: 10px;
    }

    .citizen-info.mobile {
        justify-content: center;
    }

    .info {
        display: flex;
        flex-direction: column;
        flex-basis: 250px;
        max-width: 350px;
        margin-left: 20px;
        margin-bottom: 20px;
        opacity: 0;
    }
</style>
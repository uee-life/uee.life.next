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
            <div class="citizen-data">
                <div class="labels">
                    <span>UEE Record: </span>
                    <span>Name: </span>
                    <span>Handle: </span>
                    <span>Enlisted: </span>
                </div>
                <div class="data">
                    <span>{{ citizen.id }}</span>
                    <span>{{ citizen.name }}</span>
                    <span>{{ citizen.handle }}</span>
                    <span>{{ citizen.enlisted }}</span>
                </div>
            </div>
        </div>
  </div>
</template>

<style scoped>
    .citizen-info {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: fit-content;
        margin-top: 20px;
    }

    .citizen-info.mobile {
        justify-content: center;
    }

    .info {
        display: flex;
        flex-direction: column;
        flex-basis: 250px;
        flex-grow: 1;
        max-width: 350px;
        margin-left: 20px;
        margin-bottom: 20px;
        opacity: 0;
    }

    .citizen-data {
        display: flex;
    }

    .citizen-data .labels {
        display: flex;
        flex-direction: column;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
    }
    .citizen-data .data {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 19px;
        margin-left: 10px;
        color: #dbf3ff;
    }
</style>
<template>
    <div id="citizen-info" class="citizen-info">
        <div class="citizen-portrait" id="portrait">
            <div class="portrait-content">
            <citizen-portrait :citizen="citizen" />
            </div>
            <!--img class="portrait-img" :src="citizen.info.portrait" />
            <span class="verified"><img v-if="citizen.info.verified" src="@/assets/verified.png" /></span-->
            <span class="corner top left"></span>
            <span class="corner top right"></span>
            <span class="corner bottom left"></span>
            <span class="corner bottom right"></span>
        </div>
        <div class="info">
            <div class="citizen-data">
                <div class="labels">
                    <span>UEE Record: </span>
                    <span>Name: </span>
                    <span>Handle: </span>
                    <span>Enlisted: </span>
                </div>
                <div class="data">
                    <span>{{ citizen.record }}</span>
                    <span>{{ citizen.name }}</span>
                    <span>{{ citizen.handle }}</span>
                    <span>{{ citizen.enlisted }}</span>
                </div>
            </div>
            <br>
        <!--citizen-location :isOwner="isOwner" :home="citizen.home" @refresh="refresh" /-->
        </div>
  </div>
</template>

<script setup>
import { gsap } from "gsap"

const props = defineProps({
    citizen: {
        type: Object
    },
    isOwner: {
        type: Boolean
    }
})

computed({
    componentClass() {
        if(this.isMobile) {
            return 'citizen-info mobile'
        } else {
            return 'citizen-info'
        }
    }
})

function refresh() {
    // this.$emit('refresh')
}

onMounted(() => {
    nextTick(() => {
            let size = "180px"
            const tl = gsap.timeline()
            tl.to(".citizen-portrait", {duration: 0.5, opacity: 1})
            tl.to(".citizen-portrait", {duration: 0.5, width: size, height: size})
            tl.to(".citizen-portrait .portrait-content", {duration: 0.5, opacity: 1})
            tl.to(".citizen-info .info", {duration: 0.5, opacity: 1})
        })
})
</script>

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

    .citizen-portrait{
        display: flex;
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        padding: 7px;
        margin: 0;
        margin-bottom: 10px;
        background: url('/images/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        position: relative;
        align-self: auto;
        align-items: center;
        justify-content: center;
        opacity: 0;
    }

    .portrait-content {
        opacity: 0;
    }

    .info {
        display: flex;
        flex-direction: column;
        flex-basis: 250px;
        flex-grow: 1;
        max-width: 350px;
        margin-left: 20px;
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
        line-height: 19.5px;
        margin-left: 10px;
        color: #dbf3ff;
    }
</style>
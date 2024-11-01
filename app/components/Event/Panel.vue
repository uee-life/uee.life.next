<script setup>
import { gsap } from 'gsap'

const firstImage = ref(true)

const rotate = () => {
    const tl = gsap.timeline()
    tl.to('.event-img', {duration: 0.5, opacity: 0})
    tl.call(() => {firstImage.value = !firstImage.value})
    tl.to('.event-img', {duration: 0.5, opacity: 1})
}

const update = setInterval(() => {
    rotate()
}, 10000);

onBeforeUnmount(() => {
    clearInterval(update)
})
</script>

<template>
    <div class="event">
        <!--a target="_blank" href=""-->
            <div class="event-img">
                <img v-if="firstImage" src="/images/events/IAE2954-1.jpg" />
                <img v-else src="/images/events/IAE2954-2.jpg" />
            </div>
        <!--/a-->
    </div>
</template>

<style scoped>
.event {
    margin-bottom: -5px;
}
.event-img>img {
    width: 100%;
}
</style>
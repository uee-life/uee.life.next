<template>
    <panel-dock type="made-by" class="made-by">
        <img class="made-by-img" src="@/assets/community.png" />
    </panel-dock>
</template>
  
<script setup>
import Gsap from 'gsap';

onMounted(() => {
    Gsap.to('.made-by', {delay: 0.5, duration: 1, opacity: 1})
})
</script>

<style>
    .made-by {
        opacity: 0;
        display: flex;
        justify-content: center;
    }
    .made-by-img {
        width: 220px;
    }
</style>
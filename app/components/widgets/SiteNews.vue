<template>
    <panel-main title="Site News" class="site-news" id="site-news" :style="newsHeight">
        <div class="content">
            <panel-mdContent content="siteNews.md"/>
            <div class="read-more" @click="toggleNews()">{{ buttonText }}</div>
        </div>
    </panel-main>
</template>

<script setup>
import { gsap } from 'gsap/gsap-core';
let showing = false
let newsHeight = "height: 100px"
let buttonText = ref("Read More")

const toggleNews = () => {
    if(showing) {
        gsap.to(".site-news", {duration: 0.5, height: '100px'})
        buttonText.value = "Read More"
        showing = false
    } else {
        gsap.fromTo(".site-news", {duration: 0.5, height: '100px'}, {height: 'auto'})
        buttonText.value = "Hide"
        showing = true
    }
}
</script>

<style scoped>

    .site-news .title .date {
        font-size: 12px;
    }

    .site-news>.content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .site-news>.content>h3 {
        word-spacing: 8px;
    }

    .site-news>.content>.read-more {
        position: absolute;
        top: 0px;
        right: 0px;
    }

    .site-news>.content>.read-more:hover {
        color: #dbf3ff;
        cursor: pointer;
    }
</style>
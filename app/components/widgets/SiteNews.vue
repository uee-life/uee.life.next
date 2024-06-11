<template>
    <panel title="Site News" class="site-news" id="site-news">
        <div class="news">
            <markdown file="siteNews.md"/>
        </div>
        <div class="read-more" @click="toggleNews()">{{ buttonText }}</div>
    </panel>
</template>

<script setup>
import { gsap } from 'gsap';
let showing = false
let newsHeight = "height: 130px"
let buttonText = ref("Read More")

const toggleNews = () => {
    if(showing) {
        gsap.to(".news", {duration: 0.5, height: '130px'})
        buttonText.value = "Read More"
        showing = false
    } else {
        gsap.fromTo(".news", {height: '130px'}, {height: 'auto', duration: 0.5})
        buttonText.value = "Hide"
        showing = true
    }
}
</script>

<style scoped>
    .news {
        height: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .news .title .date {
        font-size: 12px;
        padding-top: 10px;
    }

    .news>.news-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .read-more {
        position: absolute;
        bottom: 5px;
        right: 10px;
    }

    .read-more:hover {
        color: #dbf3ff;
        cursor: pointer;
    }
</style>
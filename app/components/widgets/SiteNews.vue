<template>
    <panel title="Site News" class="site-news" id="site-news">
        <div class="news">
            <markdown file="siteNews.md"/>
        </div>
        <div class="read-more" @click="toggleNews()">
            {{ buttonText }}
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </div>
    </panel>
</template>

<script setup>
import { gsap } from 'gsap';
let showing = false
let newsHeight = "height: 130px"
let buttonText = ref("MORE")

const toggleNews = () => {
    if(showing) {
        gsap.to(".news", {duration: 0.5, height: '130px'})
        buttonText.value = "MORE"
        showing = false
    } else {
        gsap.fromTo(".news", {height: '130px'}, {height: 'auto', duration: 0.5})
        buttonText.value = "LESS"
        showing = true
    }
}
</script>

<style scoped>
    .site-news {
        padding-left: 20px;
        padding-right: 50px;
        padding-bottom: 20px;
    }

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
        bottom: 10px;
        right: 10px;
        font-size: 12px;
        line-height: 16px;
        padding: 2px 4px 0;
    }

    .read-more:hover {
        color: #dbf3ff;
        cursor: pointer;
    }
</style>
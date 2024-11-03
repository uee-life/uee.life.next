<template>
    <panel ref="newsitem" class="news-item" id="news-item" :title="item.source" title-size="small">
        <a :href="item.link" style="text-decoration: none" target="blank">
            <div class="news-content">
                <div class="background" :style="style"></div>
                <div class="mask"></div>
                <div class="article-image" :style="style">
                    <nuxt-img src="/images/padimg.png" />
                </div>
                <div class="news-item-info">
                    <div><b>{{ item.title }}</b></div>
                    <div>Posted: {{ item.posted }}</div>
                    <div>{{ item.source }}</div>
                </div>
            </div>
            <nuxt-img class="source-img" :src="item.source_img" :title="item.source"/>
        </a>
    </panel>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const img = useImage()

const style = computed({
    get() {
        return 'background: url("' + img(props.item.image) + '"); background-size: cover; background-position: center center;'
    }
})
</script>

<style>
.article-image {
    max-width: 30vw;
    height: 100%;
    flex-basis: content;
    flex-grow: 0;
    z-index: 2;
    border: 2px solid black;
}

.article-image img {
    display: block;
    width: 100%;
    height: auto;
}

.source-img {
    position: absolute;
    width: 32px;
    height: 32px;
    bottom: 5px;
    right: 5px;
}

.news-item {
    display: flex;
    margin: 10px;
    padding: 9px;
    position: relative;
    opacity: 1;
    flex-grow: 1;
    max-width: calc(100vw - 20px) !important;
    max-height: 100vh !important;
}

.news-item .news-content {
    display: flex;
    flex-grow: 1;
}

.news-item-info {
    flex-basis: 400%;
    margin-left: 10px;
    text-decoration: none;
    color: #dbf3ff;
    text-shadow: 2px 2px 4px #000;
}

.news-item .background {
    opacity: 0.5 !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
}

.news-item .mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: url('@/assets/fading-bars.png') repeat;
    z-index: 0;
}
</style>
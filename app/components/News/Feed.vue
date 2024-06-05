<template>
    <div class="news-feed" id="news-feed">
        <teleport to="#news-filter">
            <div class="sources">
                <div v-for="source in sources" @click.native="setSource(source)" :key="source.id" class="left-nav-button">
                    <router-link to="/">{{ source.name }}</router-link>
                </div>
            </div>
        </teleport>
        <panel-title :text="title" size="medium"/>
        <div v-if="pending" class="loading">
            <img src="@/assets/loading.gif" >
        </div>
        <div v-if="pending" class="loading"><img src="@/assets/loading.gif" ></div>
        <transition-group v-else
            name="staggered-fade"
            tag="div"
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            class="t-group">
            <news-item v-for="(item, index) in articles" :key="item.id" :index="index" :item="item" />
        </transition-group>
        <div class="more" v-if="more" @click="loadMore()">
            Load More
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </div>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

let article_ids = []
let pages = 1
let more = true
const search = ref({channel: "spectrum-dispatch", series: "news-update"})
const title = ref("Verse Watch")

const sources = [
        {
            name: "Verse Watch",
            search: {
                channel: "spectrum-dispatch",
                series: "news-update"
            }
        },
        {
            name: "RSI News",
            search: {
                channel: "transmission",
                series: "all"
            }
        },
        {
            name: "Historical Records",
            search: {
                channel: "spectrum-dispatch", 
                series: "time-capsule"
            }
        },
        {
            name: "Universe Fiction",
            search: {
                channel: "serialized-fiction",
                series: "all"
            }
        }
    ]

// client only, because hydration issues
const { data: articles, pending, refresh } = await useFetch(() => `/api/news?channel=${search.value.channel}&series=${search.value.series}&page=${pages}`, {
    key: 'getNews',
    server: false,
    lazy: true
})

async function setSource(source) {
    search.value = source.search
    title.value = source.name
    await refreshNews()
}

function checkIDs(arts) {
    const filtered = arts.filter((item) => {
        return !article_ids.includes(item.id)
    })
    for (let i in filtered) {
        article_ids.push(filtered[i].id)
    }
    return filtered
}

// fancy transition event handlers
function beforeEnter(el) {
    el.style.opacity = 0
}
function enter(el) {
    var delay = (el.getAttribute('index') % 10) * 250
    setTimeout(function() {
        gsap.to(el, {duration: 1, opacity: 0.9})
    }, delay)
}
function leave(el) {
    gsap.to(el, {duration: 2, opacity: 0})
}

// load more articles
async function loadMore() {
    if(!pending.value && more) {
        pages += 1
        const url = '/api/news?channel=' + search.value.channel + '&series=' + search.value.series + '&page=' + pages
        const news = await $fetch(url)
        articles.value = articles.value.concat(checkIDs(news.value))
    }
}

async function refreshNews() {
    pages = 1
    articles.value = []
    article_ids = []
    await refresh()
}

onMounted(() => {
    gsap.to('.news-feed', {delay: 0.5, duration: 1, opacity: 1})
})
</script>

<style>
    .news-feed {
        position: relative;
        display: flex;
        flex-basis: 500px;
        display: block;
        padding-top: 10px;
        margin-top: 20px;
        margin-left: -10px;
        margin-right: -10px;
        opacity: 0;
    }

    .news-filter .sources {
        width: 100%;
    }

    .news-feed>.t-group {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
    }

    .news-feed .more {
        position: relative;
        width: 100% - 20px;
        display: flex;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        margin: 5px 10px 20px 10px;
        background: url('/images/fading-bars.png') repeat;
    }

    .news-feed .more:hover {
        color: #dbf3ff;
    }

    .feed-title {
        font-size: 20px;
    }

    .nav-button {
        margin-left: 10px;
        margin-right: 10px;
    }
    .nav-button a {
      text-decoration: none;
      color: #39ced8;
    }
</style>
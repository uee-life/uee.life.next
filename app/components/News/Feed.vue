<template>
    <div class="news-feed" id="news-feed">
        <!--portal to="news-filter">
            <div class="sources">
                <div v-for="source in sources" v-on:click="search = source.search; title = source.name" :key="source.id" class="left-nav-button">
                    <router-link to="/">{{ source.name }}</router-link>
                </div>
            </div>
        </portal>-->
        <layout-section-title :text="title" size="medium"/>
        <transition-group
            name="staggered-fade"
            tag="div"
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            class="t-group">
            <news-item v-for="(item, index) in articles" :key="item.id" :index="index" :item="item" />
        </transition-group>
        News Feed
        <div v-if="pending" class="loading">
            <img src="@/assets/loading.gif" >
        </div>
        <div class="more" v-else-if="more" @click="loadMore()">
            Load More
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </div>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

const title = "Verse Watch"
const articles = []
const article_ids = []
var pages = 1
var loading = false
var more = true
const search = {channel: "spectrum-dispatch", series: "news-update"}
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

var pending = 0


function clearNews() {
    articles = []
    article_ids = []
    pages = 1
    more = true
}
async function getNews() {
    loading = true

    const { data: articles, pending } = await useLazyFetch('/api/news', {
        transform: (_articles) => _articles.data
    })
    console.log('testing')
    console.log(articles)
    loading = false
}
/*checkIDs(arts) {
    const filtered = arts.filter((item) => {
        return !this.article_ids.includes(item.id)
    })
    for (let i in filtered) {
        this.article_ids.push(filtered[i].id)
    }
    return filtered
},*/
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
function loadMore() {
    if(!loading && more) {
        getNews()
    }
}

onMounted(() => {
    getNews()
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
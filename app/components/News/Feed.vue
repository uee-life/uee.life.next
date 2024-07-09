<template>
    <div class="news-feed" id="news-feed">
        <widgets-loading v-if="status != 'success' && articles.length == 0"/>
        <template v-else>
            <client-only>
                <teleport to="#news-filter">
                    <div class="sources">
                        <div v-for="source in sources" @click.native="setSource(source)" :key="source.id" class="left-nav-button">
                            <router-link to="/">{{ source.name }}</router-link>
                        </div>
                    </div>
                </teleport>
            </client-only>
            <panel-title :text="title" size="medium"/>
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
            <panel-button class="more" text="Load More" v-if="more" @click="loadMore()" />
        </template>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

const articles = ref([])
const article_ids = ref([])
const pages = ref(1)
const more = ref(true)
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
const { status, refresh } = await useAPI(() => `/api/news?channel=${search.value.channel}&series=${search.value.series}&page=${pages.value}`, {
    key: 'getNews',
    server: false,
    lazy: true,
    onResponse({ response }) {
        articles.value = articles.value.concat(checkIDs(response._data.data))
    }
})

async function setSource(source) {
    search.value = source.search
    title.value = source.name
    pages.value = 1
    articles.value = []
    article_ids.value = []
    await refresh()
}

function checkIDs(arts) {
    const filtered = arts.filter((item) => {
        return !article_ids.value.includes(item.id)
    })
    filtered.forEach(element => {
        article_ids.value.push(element.id)
    })
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
    if(status.value == 'success' && more.value) {
        pages.value += 1
        await refresh()
    }
}

onMounted(() => {
    gsap.to('.news-feed', {delay: 1, duration: 1, opacity: 1})
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
        background: url('@/assets/fading-bars.png') repeat;
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
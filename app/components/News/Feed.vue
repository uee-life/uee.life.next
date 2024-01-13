<template>
    <div class="news-feed" id="news-feed">
        <!--portal to="news-filter">
            <div class="sources">
                <div v-for="source in sources" v-on:click="search = source.search; title = source.name" :key="source.id" class="left-nav-button">
                    <router-link to="/">{{ source.name }}</router-link>
                </div>
            </div>
        </portal>
        <section-title :text="title" size="medium"/>
        <transition-group
            name="staggered-fade"
            tag="div"
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            class="t-group">
            <news-item v-for="(item, index) in articles" :key="item.id" :index="index" :item="item" />
        </transition-group-->
        News Feed
        <news-item />
        <div v-if="articles.length == 0" class="loading">
            <img src="@/assets/loading.gif" >
        </div>
        <div class="more" v-else-if="more" @click="loadMore()">
            Load More
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </div>
    </div>
</template>

<script>
//import { gsap } from 'gsap'


export default {
    name: "news-feed",
    data() {
        return {
            title: "Verse Watch",
            articles: [],
            article_ids: [],
            pages: 1,
            loading: 0,
            more: true,
            search: {channel: "spectrum-dispatch", series: "news-update"},
            sources: [
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
        }
    },
    mounted() {
        this.getNews()
    },
    methods: {
        clearNews() {
            this.articles = []
            this.article_ids = []
            this.pages = 1
            this.more = true
        },
        async getNews() {
            this.articles = []
            /*this.loading = true
            
            // Use Axios to make a call to the API
            this.$axios({
                url: 'https://api.uee.life/news?channel=' + this.search.channel + '&series=' + this.search.series + '&page=' + this.pages,
                method: 'GET'
            }).then((res) => {
                if(res.data.length < 10) {
                    this.more = false
                }
                const new_articles = this.checkIDs(res.data)
                this.articles = this.articles.concat(new_articles)
                this.pages += 1;
            }).catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error) 
            })
            this.loading = false*/
        },
        checkIDs(arts) {
            const filtered = arts.filter((item) => {
                return !this.article_ids.includes(item.id)
            })
            for (let i in filtered) {
                this.article_ids.push(filtered[i].id)
            }
            return filtered
        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el) {
            var delay = (el.getAttribute('index') % 10) * 250
            setTimeout(function() {
                gsap.to(el, {duration: 1, opacity: 0.9})
            }, delay)
        },
        leave: function(el) {
            gsap.to(el, {duration: 2, opacity: 0})
        },
        loadMore: function() {
            if(!this.loading && this.more) {
                this.getNews()
            }
        }
    },
    watch: {
        search: function() {
            this.clearNews()
            this.getNews()
        }
    }

}
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
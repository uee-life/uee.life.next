<template>
    <client-only>
    <div class="org-members">
        <div v-if="loading" class="loading">
            <img src="@/assets/loading.gif">
        </div>
        <div v-else-if="members" class="results">
            <div v-for="(member, index) in members" :key="member.handle + index" class='org-cell'>
                <router-link :to="citizenLink(member.handle)" :class='checkRedaction(member.handle, "")'>
                    <div class="left">
                        <div class="thumb">
                            <img :src="member.thumb"/>
                        </div>
                        <div class="identity">
                            <h3 :class='checkRedaction(member.handle, "")'>{{member.handle}}</h3>
                            <!--span class="symbol"><img class="star" src="@/assets/star.png" v-for="n in parseInt(member.stars)" :key="n"></span-->
                        </div>
                    </div>
                    <div :class='checkRedaction(member.handle, "mask")'></div>
                    <img v-if="member.verified" class="verified" src="@/assets/verified.png">
                </router-link>
            </div>
        </div>
        <div v-else class="no-results">
            <span class="text big">
                No Results
                <div class="endcap left"></div>
                <div class="endcap right"></div>
            </span>
        </div>
        <layout-pages
            @nextPage="pageChangeHandler('next')"
            @prevPage="pageChangeHandler('previous')"
            @load-page="pageChangeHandler" 
            :currentPage="currentPage" 
            :pageCount="pageCount" />
    </div>
</client-only>
</template>

<script setup>
import { onMounted } from 'vue';

const route = useRoute()

//import Pagination from '@/components/layout/Pagination.vue'

const props = defineProps({
    affiliate: {
        type: Boolean,
        default: false
    }
})

const loading = ref(false)
const members = ref([])
const memberCount = ref(0)
const currentPage = ref(1)

const pageCount = computed({
    get() {
        return Math.ceil(memberCount.value / 32)
    }
})

function citizenLink(handle) {
    if(handle == "Redacted") {
        return `/citizens/${route.params.tag}`
    } else {
        return `/citizens/${handle}`
    }
}

function checkRedaction(handle, cls) {
    if(handle == "Redacted") {
        return cls + " redacted"
    } else {
        return cls
    }
}

function pageChangeHandler(value) {
    switch (value) {
        case 'next':
            currentPage.value += 1
            break
        case 'previous':
            currentPage.value -= 1
            break
        default:
            currentPage.value = value
    }
    getMembers()
}

async function getMembers() {
    const org = route.params.tag
    let type = "members"
    if(props.affiliate) {
        type = "affiliates"
    }
    await useFetch(`/api/org/${org}/${type}?page=${currentPage.value}`, {
        key: 'getMembers',
        server: false,
        lazy: true,
        onResponse(_ctx) {
            const res = _ctx.response._data
            members.value = res.members
            memberCount.value = res.count
            loading.value = false
        }
    })
}


getMembers()

/*export default {
    name: 'org-members',
    props: {
        affiliate: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Pagination
    },
    data: () => {
        return {
            currentPage: 1,
            members: [],
            memberCount: 1,
            loading: true
        }
    },
    methods: {
        citizenLink(handle) {
            if(handle == "Redacted") {
                return this.$router.currentRoute
            } else {
                return `/citizens/${handle}`
            }
        },
        checkRedaction(member, cls) {
            if(member.handle == "Redacted") {
                return cls + " redacted"
            } else {
                return cls
            }
        },
        pageChangeHandler(value) {
            switch (value) {
                case 'next':
                    this.currentPage += 1
                    break
                case 'previous':
                    this.currentPage -= 1
                    break
                default:
                    this.currentPage = value
            }
            this.getMembers(this.currentPage)
        },
        async getMembers() {
            const org = this.$route.params.org
            let type = "members"
            if(this.affiliate) {
                type = "affiliates"
            }
            this.$axios({
                url: `https://api.uee.life/orgs/${org}/${type}?page=${this.currentPage}`,
                method: 'GET'
            }).then((res) => {
                if(res.status == 200) {
                    this.members = res.data.members
                    this.memberCount = res.data.count
                    this.members.sort((a, b) => {
                        return b.stars - a.stars;
                    })
                    this.loading = false
                }
            }).catch((err) => {
                // eslint-disable-next-line
                console.error(err)
            })

        }
    },
    computed: {
        pageCount() {
            // eslint-disable-next-line
            console.log(this.memberCount)            
            // eslint-disable-next-line
            console.log(Math.ceil(this.memberCount / 32))
            return Math.ceil(this.memberCount / 32)
        }
    },
    mounted() {
        this.currentPage = 1
        this.getMembers()
    },
    watch: {
        route: {
            handler: function () {
                this.currentPage = 1
                this.getMembers()
            }
        },
        affiliate: {
            handler: function() {
                this.currentPage = 1
                this.getMembers()
            }
        }
    }
}*/
</script>

<style scoped>

    .org-cell {
        display: flex;
        flex-grow: 1;
        margin: 5px;
    }

    .org-cell .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.1;
    }

    .org-cell .mask.redacted {
        background-color: #ff2222;
    }

    .org-cell>a {
        display: flex;
        background: url('/images/fading-bars.png') repeat;
        padding: 5px;
        position: relative;
        height: fit-content;
        border: 1px solid #546f84;
        flex-grow: 1;
        text-decoration: none;
    }

    .org-cell>a.redacted {
        border: 1px solid #ff2222;
    }

    .org-cell>a>.left {
        display: flex;
    }

    .org-cell>a>.left>.thumb {
        display: inline-block;
        width: 70px;
        height: 70px;
        position: relative;
    }

    .org-cell>a>.left>.thumb>img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .org-cell>a>.left>.identity {
        display: flex;
        line-height: 16px;
        max-width: 250px;
        flex-direction: column;
        justify-content: center;
        margin: 0;
        margin-left: 10px;
    }

    .org-cell>a>.left>.identity>h3.redacted {
        color: #ff1111;
    }

    .org-cell>a>.left>.identity>h3 {
        font-size: 14px;
        color: #dbf3ff;
        margin: 0;
    }

    .org-cell>a>.left>.identity>.symbol {
        font-size: 11px;
        color: #739cb0;
    }

    .org-cell>a>.left>.identity>.symbol>.star {
        width: 20px;
        margin-bottom: -10px;
    }

    .verified {
        position: absolute;
        right: 3px;
        bottom: 3px;
        width: 25px;
    }
</style>

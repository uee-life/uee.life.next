<template>
    <client-only>
    <div class="org-members">
        <div v-if="pending" class="loading">
            <img src="@/assets/loading.gif">
        </div>
        <div v-else-if="members" class="results">
            <citizen-card v-for="(member, index) in members" :key="member.handle + index" :citizen="member" class='org-cell' />
        </div>
        <widgets-no-result v-else />
        <layout-pages v-if="members"
            @nextPage="pageChangeHandler('next')"
            @prevPage="pageChangeHandler('previous')"
            @load-page="pageChangeHandler" 
            :currentPage="currentPage" 
            :pageCount="pageCount" />
    </div>
</client-only>
</template>

<script setup>
const route = useRoute()

const props = defineProps({
    affiliate: {
        type: Boolean,
        default: false
    }
})
const members = ref([])
const memberCount = ref(0)
const currentPage = ref(1)

const pageCount = computed({
    get() {
        return Math.ceil(memberCount.value / 32)
    }
})

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
    refresh()
}


const {pending, refresh} = await useFetch(() => `/api/org/${route.params.tag}/${props.affiliate ? "affiliates" : "members"}?page=${currentPage.value}`, {
    key: 'getMembers',
    server: false,
    lazy: true,
    onResponse(_ctx) {
        const res = _ctx.response._data
        members.value = res.members
        memberCount.value = res.count
    }
})
</script>

<style scoped>

    .org-cell {
        display: flex;
        flex-grow: 1;
        margin: 5px;
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

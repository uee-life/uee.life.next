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
        <layout-pagination v-if="members"
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
</style>

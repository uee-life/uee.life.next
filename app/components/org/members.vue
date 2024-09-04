<template>
    <client-only>
        <div class="org-members">
            <div v-if="status != 'success'" class="loading">
                <img src="@/assets/loading.gif">
            </div>
            <template v-else-if="members.data">
                <div class="results">
                    <citizen-card v-for="(member, index) in members.data.members" :key="member.handle + index" :citizen="member" class='org-cell' />
                </div>
                <layout-pagination v-if="members.data.members"
                @nextPage="pageChangeHandler('next')"
                @prevPage="pageChangeHandler('previous')"
                @load-page="pageChangeHandler" 
                :currentPage="currentPage" 
                :pageCount="pageCount" />
            </template>
            <widgets-no-result v-else />
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

const currentPage = ref(1)

const pageCount = computed({
    get() {
        return Math.ceil(members.value.data.count / 32)
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

const {data: members, status, refresh} = useAPI(() => `/api/orgs/${route.params.tag}/${props.affiliate ? "affiliates" : "members"}?page=${currentPage.value}`, {
    key: 'getMembers',
    server: false,
    lazy: true
})
</script>

<style scoped>
</style>

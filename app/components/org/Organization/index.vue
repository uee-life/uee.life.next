<script setup>
const route = useRoute()
const auth = useAuthStore()

const props = defineProps({
    org: {
        type: Object,
        required: true
    }
})

const selected = ref('')

const setSelected = (id) => {
    selected.value = id
}

const isAdmin = computed({
    get() {
        if (status.value == 'success' && auth.isAuthenticated && auth.user.verified && data.value.data.admins.find((admin) => admin.handle == auth.citizen.handle)) {
            return true
        } else {
            return false
        }
    }
})

const reset = () => {
    selected.value = data.data.info.id
    refresh()
}

const { status, data, refresh} = await useAPI(() => `/api/orgs/${props.org.id}/organization`, {
    onResponse({ response }) {
        selected.value = response._data.data.info.id
    }
})
</script>

<template>
    <widgets-loading v-if="status != 'success'" />
    <div v-else>
        <panel class="org-chart" title="Org Hierarchy" title-size="small">
            <layout-chart-org v-if="status == 'success'"
                :datasource="data.data"
                :selected="selected"
                @setSelected="setSelected" />
        </panel>
        <group-org 
            :group="data.data"
            :is-admin="isAdmin"
            :selected="selected"
            :members="[]"
            @refresh="refresh" 
            @reset="reset" 
            @return="navigateTo(`/orgs/${org.data.org.id}`)">
            <template v-slot:assignment>
                <panel style="margin:10px; text-align: center;" title="Assignment" title-size="small">Log in to view assignment</panel>
            </template>
        </group-org>

    </div>
</template>

<style scoped>

</style>
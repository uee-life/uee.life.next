<script setup>
const { $api } = useNuxtApp()

const props = defineProps({
    org: {
        type: Object,
        default: function () {
            return {}
        }
    },
    isOwner: {
        type: Boolean,
        default: false
    }
})

const modals = ref({
    fleet: false
})

const addFleet = async (fleet) => {
    modals.value.fleet = false
    console.log('adding fleet: ')
    console.log(fleet)
    const result = await $api(`/api/orgs/${props.org.tag}/fleets/add`, {
        method: 'POST',
        body: fleet
    })
    refresh()
}

const selected = (fleet) => {
    navigateTo(`/fleets/${fleet.id}`)
}

const { data: fleets, status, refresh } = useAPI(`/api/orgs/${props.org.tag}/fleets`)
</script>

<template>
    <div class="org-fleet">
        <panel-title text="Org Fleets" class="title"/>
        <template v-if="status == 'success'">
            <template v-if="fleets.data.length > 0">
                <fleet-summary v-for="item in fleets.data" :fleet="item.fleet" @selected="selected"/>
            </template>
            <widgets-no-result text="No Fleets Configured" v-else />
        </template>
        <WidgetsLoading v-else />
        <panel-button v-if="isOwner" text="Add Fleet" class="add-fleet" @click="modals.fleet = true" />
        <layout-modal v-if="modals.fleet" title="Add Fleet" @close="modals.fleet = false">
            <forms-fleet @submit="addFleet"/>
        </layout-modal>
    </div>
</template>

<style scoped>
.title {
    opacity: 1;
}
</style>
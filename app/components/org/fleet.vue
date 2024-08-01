<script setup>
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

const { data: fleets, status, refresh } = await useAPI(`/api/orgs/${props.org.tag}/fleets`)
</script>

<template>
    <div class="org-fleet">
        <panel-title text="Org Fleets" class="title"/>
        <template v-if="status == 'success'">
            <template v-if="fleets.data.length > 0">
                {{ fleets.data }}
            </template>
            <widgets-no-result text="No Fleets Configured" v-else />
        </template>
        <WidgetsLoading v-else />
        <panel-button v-if="isOwner" text="Add Fleet" class="add-fleet" @click="modals.fleet = true" />
        <layout-modal v-if="modals.fleet" title="Add Fleet" @close="modals.fleet = false">
            <forms-fleet />
        </layout-modal>
    </div>
</template>

<style scoped>
.title {
    opacity: 1;
}
</style>
<script setup>
const route = useRoute()

const fleetLink = computed({
    get() {
        if (status.value == 'success') {
            return `/fleets/${assignment.value.data.fleet.info.id}`
        } else {
            return '/foo'
        }
    }
})

const { data: assignment, refresh, status } = useAPI(`/api/assignments/${route.params.id}`)
</script>

<template>
    <widgets-loading v-if="status == 'pending'" />
    <div v-else-if="status == 'success' && assignment.status == 'success'">
        <layout-banner 
            display="full"
            :name="assignment.data.fleet.org.name"
            :tag="assignment.data.fleet.info.name"
            :type="assignment.data.fleet.info.purpose"
            :image="`/images/ships/${assignment.data.identifier}.jpg`"
            :logo="assignment.data.fleet.org.logo" 
            @clicked="navigateTo(fleetLink)"/>
        <ship :ship="assignment.data.ship" />
        <ship-crew :ship="assignment.data.ship" :edit="isOwner"/>
        {{assignment.data.assignment}}
    </div>
    <widgets-no-result v-else text="Assignment not found" />
</template>

<style scoped>

</style>
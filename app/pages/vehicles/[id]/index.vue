<script setup>
const route = useRoute()
const auth = useAuthStore()

const isOwner = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && auth.citizen.handle.toLowerCase().trim() == response.value.data.owner.handle.toLowerCase().trim()
    }
})

const {status, data: response, refresh} = useAPI(`/api/vehicles/${route.params.id}`, {
    key: 'getVehicle'
})

</script>

<template>
    <widgets-loading v-if="status == 'pending'" />
    <div v-else-if="response.status == 'success'">
        <layout-banner 
            :name="response.data.model"
            :tag="response.data.name"
            :type="response.data.career + ' / ' + response.data.role"
            :image="`/images/ships/${response.data.identifier}.jpg`"
            :logo="`/images/manufacturers/${response.data.manufacturer}.png`"/>
        <vehicle-info  :vehicle="response.data" />
        <assignment v-for="assignment in response.data.assignments" 
            :assignment="assignment" 
            :max-assignees="response.data.max_crew"
            :owner="isOwner"
            default-role="Crewmember"
            @refresh="refresh" />
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style>

</style>
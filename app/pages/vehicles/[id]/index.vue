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
            display="full"
            :name="response.data.model.model"
            :tag="response.data.model.name"
            :type="response.data.model.career + ' / ' + response.data.model.role"
            :image="`/images/ships/${response.data.model.identifier}.jpg`"
            :logo="`/images/manufacturers/${response.data.manufacturer.id}.png`"
            />
        <panel title="Description" title-size="small">
            {{ response.data.model.description }}
        </panel>
        <vehicle-model  :vehicle="response.data.model" />
        <!--assignment v-for="assignment in response.data.assignments" 
            :assignment="assignment" 
            :max-assignees="response.data.max_crew"
            :owner="isOwner"
            default-role="Crewmember"
            @refresh="refresh" /-->

            {{ response.data }}
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style>

</style>
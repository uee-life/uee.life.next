<script setup>
const route = useRoute()
const auth = useAuthStore()

const isOwner = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && auth.citizen.handle.toLowerCase().trim() == response.value.data.owner.handle.toLowerCase().trim()
    }
})

const vehicle = ref({})

const {status, data: response, refresh} = useAPI(`/api/vehicles/${route.params.id}`, {
    key: 'getVehicle',
    server: false,
    lazy: true,
    onResponse({response}) {
        if (response._data.status == 'success') {
            vehicle.value = response._data.data
            vehicle.value.model.hardpoints = JSON.parse(vehicle.value.model.hardpoints)
        } else {
            vehicle.value = {}
        }
        
    }
})

</script>

<template>
    <widgets-loading v-if="status == 'pending'" />
    <div v-else-if="status == 'success' && response.status == 'success' && vehicle">
        <layout-banner 
            display="full"
            :name="vehicle.model.model"
            :tag="vehicle.model.name"
            :type="vehicle.model.career + ' / ' + vehicle.model.role"
            :image="`/images/ships/${vehicle.model.identifier}.jpg`"
            :logo="`/images/manufacturers/${vehicle.manufacturer.id}.png`"
            />
        <panel title="Description" title-size="small">
            {{ vehicle.model.description }}
        </panel>
        <vehicle-model  :vehicle="vehicle.model" />
        <panel title="manufacturer info" title-size="small"><layout-info :items="vehicle.manufacturer" /></panel>
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style>

</style>
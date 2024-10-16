<script setup>
const route = useRoute()
const auth = useAuthStore()

const isOwner = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && auth.citizen.handle.toLowerCase().trim() == response.value.data.owner.handle.toLowerCase().trim()
    }
})

//const vehicle = ref({})

const {status, data: vehicle, refresh} = useAPI(`/api/vehicles/${route.params.id}`, {
    key: 'getVehicle',
    onResponse({response}) {
        /*if (response._data.status == 'success') {
            vehicle.value = response._data.data
            vehicle.value.model.hardpoints = JSON.parse(vehicle.value.model.hardpoints)
        } else {
            vehicle.value = {}
        }*/
        
    }
})

</script>

<template>
    <widgets-loading v-if="status == 'pending'" />
    <div v-else-if="status == 'success' && vehicle.status == 'success' && vehicle.data.model">
        <layout-banner 
            display="full"
            :name="vehicle.data.model.model"
            :tag="vehicle.data.model.name"
            :type="vehicle.data.model.career + ' / ' + vehicle.data.model.role"
            :image="`/images/ships/${vehicle.data.model.identifier}.jpg`"
            :logo="`/images/manufacturers/${vehicle.data.manufacturer.id}.png`"
            />
        <panel title="Description" title-size="small">
            {{ vehicle.data.model.description }}
        </panel>
        <vehicle-model  :vehicle="vehicle.data.model" />
        <panel title="manufacturer info" title-size="small">
            <layout-info :items="{
                name: vehicle.data.manufacturer.name,
                tag: vehicle.data.manufacturer.tag,
                type: vehicle.data.manufacturer.type,
                description: vehicle.data.manufacturer.description
            }" />
        </panel>
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style>

</style>
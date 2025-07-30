<script setup>
const route = useRoute()
const auth = useAuthStore()

const modals = ref({
    edit: false,
    add: false
})

const isAdmin = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && ['capn_flint', 'capn_nemo'].includes(auth.citizen.handle.toLowerCase())
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
        <client-only>
            <teleport to="#left-dock">
                <panel-dock v-if="isAdmin" class="actions" title="Admin">
                    <div class="left-nav-button" @click="modals.add = true">Add New Vehicle</div>
                    <div class="left-nav-button" @click="modals.edit = true">Edit Vehicle</div>
                </panel-dock>
            </teleport>
        </client-only>
        <layout-banner 
            display="full"
            :name="vehicle.data.model"
            :tag="vehicle.data.name"
            :type="vehicle.data.career + ' / ' + vehicle.data.role"
            :image="`/images/ships/${vehicle.data.identifier}.jpg`"
            :logo="`/images/manufacturers/${vehicle.data.manufacturer.tag}.png`"
            />
        <panel title="Description" title-size="small">
            {{ vehicle.data.description }}
        </panel>
        <vehicle-model  :vehicle="vehicle.data" />
        <panel title="manufacturer info" title-size="small">
            <layout-info :items="{
                name: vehicle.data.manufacturer.name,
                tag: vehicle.data.manufacturer.tag,
                type: vehicle.data.manufacturer.type,
                description: vehicle.data.manufacturer.description
            }" />
        </panel>
        <layout-modal v-if="modals.edit" title="Edit vehicle model" @close = "modals.edit = false">
            <forms-vehicle-model 
                :vehicle-info="vehicle.data.model" @close="modals.edit = false"/>
        </layout-modal>
        <layout-modal v-if="modals.add" title="Add a vehicle model" @close = "modals.add = false">
            <forms-vehicle-model @close="modals.add = false"/>
        </layout-modal>
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style>

</style>
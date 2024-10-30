<script setup>
const { $api } = useNuxtApp()
const route = useRoute()
const auth = useAuthStore()

const modals = ref({
    edit: false,
    add: false,
    remove: false
})

const isAdmin = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && ['capn_flint', 'capn_nemo'].includes(auth.citizen.handle.toLowerCase())
    }
})

const removeVehicleModel = async () => {
    modals.value.remove = false
    console.log('removing vehicle ', route.params.id)
    await $api(`/api/admin/vehicles/remove`, {
        method: 'POST',
        body: {
            id: route.params.id
        }
    })
    navigateTo('/explore')
}

//const vehicle = ref({})

const {status, data: vehicle, refresh} = useAPI(`/api/vehicles/${route.params.id}/model`, {
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
                    <div class="left-nav-button" @click="modals.remove = true">Delete Vehicle</div>
                </panel-dock>
            </teleport>
        </client-only>
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
        <panel title="manufacturer bio" title-size="small">
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
        <modal-confirm v-if="modals.remove" @confirm="removeVehicleModel" @cancel="modals.remove = false" />
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style>

</style>
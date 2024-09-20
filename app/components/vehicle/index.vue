<script setup>

const auth = useAuthStore()

const props = defineProps({
    vehicleId: {
        type: String,
        required: true
    },
    showOwner: {
        type: Boolean,
        default: false
    }
})

const edit = ref({
    name: false
})

const name = ref('')

const isOwner = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && auth.citizen.handle.toLowerCase().trim() == props.vehicle.owner.handle.toLowerCase().trim()
    }
})

const {status, data: vehicle, refresh} = useAPI(`/api/vehicles/${props.vehicleId}`, {
    key: 'getVehicle'
})

</script>

<template>
    <widgets-loading v-if="status == 'pending'" />
    <div v-else-if="status == 'success' && vehicle.status == 'success'">
        <template v-if="showOwner">
            <ClientOnly>
                <teleport to="#left-dock">
                    <panel-dock v-if="vehicle" title="vehicle owner" class="owner">
                        <citizen-portrait :citizen="vehicle.data.owner" :showName="true"></citizen-portrait>
                    </panel-dock>
                </teleport>
            </ClientOnly>
        </template>
        <vehicle-info :vehicle="vehicle.data" />
    </div>
    <widgets-no-result v-else text="Vehicle not found" />
</template>

<style scoped>
.vehicle-info {
    display: flex;
    flex-wrap: wrap;
    margin: 10px -10px;
}

.info-panel {
    flex-basis: 250px;
    flex-grow: 1;
    margin: 0 10px;
    padding-left: 15px;
    margin-bottom: 20px;
}

.info-items {
    display: flex;
    font-size: 14px;
    text-transform: uppercase;
}

.info-items .labels {
    display: flex;
    flex-direction: column;
}

.info-items .labels span {
    display: flex;
    width: fit-content;
}

.info-items .data {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    color: #dbf3ff;
}

.info-items .data span {
    display: flex;
}

.info-items .data .button {
    position: relative;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    cursor: pointer;
}
.owner {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
</style>
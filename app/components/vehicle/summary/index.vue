<script setup>

const props = defineProps({
    vehicle: {
        type: Object,
        default: function() {
            return {}
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['remove'])

const vehicleImage = computed({
    get() {
        return `/images/ships/${props.vehicle.identifier}.jpg`
    }
})

const manufacturerImage = computed({
    get() {
        return `/images/manufacturers/${props.vehicle.manufacturer}.png`
    }
})

const citizenLink = computed({
    get() {
        return `/citizens/${props.vehicle.owner.handle}`
    }
})

function navigate() {
    if (props.vehicle.assignment) {
        navigateTo(`/assignments/${props.vehicle.assignment.id}`)
    } else {
        navigateTo(`/vehicles/${props.vehicle.id}`)
    }
}
</script>

<template>
    <panel class="vehicle-summary" :title="vehicle.name" titleSize="small">
        <img :src="vehicleImage" />
        <img class="manufacturer" :src="manufacturerImage" />
        <div class="vehicle-info">
            <h5></h5>
            <div class="labels">
                <span v-if="vehicle.owner">Owner:</span>
                <span>Type:</span>
                <span>ID:</span>
                <span>Role:</span>
                <span v-if="vehicle.crew">Crew:</span>
            </div>
            <div class="data">
                <span v-if="vehicle.owner">{{vehicle.owner.name}}</span>
                <span>{{ vehicle.model }}</span>
                <span>{{ vehicleID(vehicle.id)}}</span>
                <span>{{ vehicle.career }} - {{ vehicle.role }}</span>
                <span v-if="vehicle.crew">{{ vehicle.crew }} / {{ vehicle.max_crew }}</span>
            </div>
        </div>
        <div class="mask" @click="navigate"></div>
        <img v-if="isAdmin" title="Remove Vehicle" class="delete" @click="$emit('remove', vehicle)" src="@/assets/delete.png">
    </panel>
</template>

<style>
    .vehicle-summary .panel-content {
        display: flex;
    }
</style>

<style scoped>
    .vehicle-summary img {
        max-width: 170px;
        flex-basis: 90%;
        flex-grow: 1;
        align-self: flex-start;
    }

    .vehicle-summary {
        display: flex;
        flex-basis: 400px;
        flex-grow: 1;
        max-width: 100vh;
        border-left: 1px solid #546f84;
        border-right: 1px solid #546f84;
        margin: 10px 5px;
    }

    .vehicle-summary .mask {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
        cursor: pointer;
    }

    .vehicle-info {
        display: flex;
        margin-left: 10px;
    }

    .vehicle-info .labels {
        display: flex;
        flex-direction: column;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
        width: 70px;
    }

    .vehicle-info .data {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 19.5px;
        margin-left: 10px;
        color: #dbf3ff;
    }

    .vehicle-info>h5 {
        font-size: 14px;
    }

    .manufacturer {
        position: absolute;
        right: 0;
        width: 100px;
        opacity: 0.4;
        z-index: -1;
    }

    .vehicle-summary .delete {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        z-index: 20;
        cursor: pointer;
    }
</style>
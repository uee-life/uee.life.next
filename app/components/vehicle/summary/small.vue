<template>
    <panel class="ship-summary" :title="vehicle.name" titleSize="small">
        <img :src="vehicleImage" />
        <img class="manufacturer" :src="manufacturerImage" />
        <div class="ship-info">
            <h5>{{ vehicle.model }}</h5>
            <div>{{ vehicle.career }} - {{ vehicle.role }}</div>
            <div v-if="vehicle.owner">Owner: {{vehicle.owner.name}}</div>
        </div>
        <div class="mask" @click="$emit('selected', vehicle.id)"></div>
        <img v-if="isAdmin" title="Remove Vehicle" class="delete" @click="$emit('remove', vehicle.id)" src="@/assets/delete.png">
    </panel>
</template>

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
</script>

<style scoped>
    img {
        max-width: 75px;
        flex-basis: 90%;
        flex-grow: 1;
        align-self: center;
    }

    .ship-summary {
        display: flex;
        flex-grow: 1;
        flex-basis: 300px;
        margin: 10px 5px;
        margin-bottom: 10px;
        padding: 9px;
        position: relative;
        background: url('@/assets/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        cursor: pointer;
    }

    .ship-summary .mask {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
    }

    .ship-info {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        padding-right: 55px;
        flex-grow: 1;
        z-index: 2;
        font-size: calc(12px + (14 - 12) * ((100vw - 300px) / (1600 - 300)));
        line-height: calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1600 - 300)));
    }

    .ship-info h5 {
        margin-top: 0;
    }

    .manufacturer {
        position: absolute;
        right: 0;
        align-self: center;
        width: 70px;
        opacity: 0.8;
    }

    .ship-summary .delete {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        z-index: 20;
        cursor: pointer;
    }
</style>
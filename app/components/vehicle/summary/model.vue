<template>
    <panel class="vehicle-summary" :title="vehicle.model" title-size="small">
        <div class="vehicle-info">
            <div class="info">
                <div class="line-item"><span class="label">Type:</span><span class="data">{{ vehicle.career }} - {{ vehicle.role }}</span></div>
                <div class="line-item"><span class="label">Size:</span><span class="data">{{ vehicleSize }}</span></div>
                <div class="line-item"><span class="label">Crew:</span><span class="data">{{ vehicle.max_crew }}</span></div>
                <div class="line-item"><span class="label">Cargo:</span><span class="data">{{ vehicle.cargo }}</span></div>
                <div class="line-item"><span class="label">Description:</span></div>
                <div class="line-item"><span class="data">{{ vehicle.description }}</span></div>
            </div>
        </div>
        <img class="vehicle" @click="selected" :src="vehicleImage" />
        <img class="manufacturer" :src="manufacturerImage" />
        <div class="mask" @click="$emit('selected', vehicle.id)"></div>
        <template v-if="isAdmin">
            <img title="Edit Vehicle" class="button edit" @click="edit" src="@/assets/edit.png" />
            <img v-if="isAdmin" title="Remove Vehicle" class="button delete" @click="remove" src="@/assets/delete.png" />
        </template>
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
        return `/images/ships/small/${props.vehicle.identifier}.jpg`
    }
})

const manufacturerImage = computed({
    get() {
        return `/images/manufacturers/${props.vehicle.manufacturer}.png`
    }
})

const vehicleSize = computed({
    get() {
        return ['Micro','Small','Medium','Large','Extra-Large','Capital'][props.vehicle.size - 1]
    }
})
</script>

<style scoped>
    .vehicle-summary img {
        max-width: 170px;
        flex-basis: 90%;
        flex-grow: 1;
        align-self: relative-right;
    }

    .vehicle-summary {
        display: flex;
        flex-grow: 1;
        margin: 10px 0;
        padding: 9px;
        position: relative;
        background: url('@/assets/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-left: 1px solid #546f84;
        border-right: 1px solid #546f84;
        min-height: 150px;
    }

    .vehicle-summary .mask {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
    }

    .vehicle-info {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        z-index: 2;
        flex-grow: 1;
        padding-right: 200px;
    }

    .vehicle-info .info {
        display: flex;
        flex-direction: column;
        font-size: 12px;
    }

    .vehicle-info .info .line-item {
        display: flex;
    }

    .vehicle-info .info .line-item .label {
        width: 80px;
        text-transform: uppercase;
        font-family: 'Michroma';
        flex-shrink: 0;
    }

    .ship-info .info .line-item .data {
        margin-left: 5px;
        font-size: 14px;
        line-height: 19.5px;
        min-width: 100px;
        margin-right: 85px;
        color: #dbf3ff;
    }

    .vehicle-info>h5 {
        font-size: 14px;
    }

    .manufacturer {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100px;
        opacity: 0.8;
    }

    .vehicle {
        position: absolute;
        right: 10px;
        top: 10px;
        opacity: 0.8;
    }

    .button {
        position: absolute;
        top: 5px;
        width: 20px;
        height: 20px;
        z-index: 20;
        cursor: pointer;
    }
    .button.delete {
        right: 5px;
    }

    .button.edit {
        right: 30px;
    }
</style>
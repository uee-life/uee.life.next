<template>
    <panel class="ship-summary" :title="ship.model" title-size="small">
        <div class="ship-info">
            <div class="info">
                <div class="line-item"><span class="label">Type:</span><span class="data">{{ ship.career }} - {{ ship.role }}</span></div>
                <div class="line-item"><span class="label">Size:</span><span class="data">{{ shipSize }}</span></div>
                <div class="line-item"><span class="label">Crew:</span><span class="data">{{ ship.max_crew }}</span></div>
                <div class="line-item"><span class="label">Cargo:</span><span class="data">{{ ship.cargo }}</span></div>
                <div class="line-item"><span class="label">Description:</span></div>
                <div class="line-item"><span class="data">{{ ship.description }}</span></div>
            </div>
        </div>
        <img  @click="selected" :src="shipImage" />
        <img class="manufacturer" :src="manufacturerImage" />
        <div class="mask" @click="$emit('selected', ship.id)"></div>
        <template v-if="isAdmin">
            <img title="Edit Ship" class="button edit" @click="edit" src="@/assets/edit.png" />
            <img v-if="isAdmin" title="Remove Ship" class="button delete" @click="remove" src="@/assets/delete.png" />
        </template>
    </panel>
</template>

<script setup>

const props = defineProps({
    ship: {
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

const shipImage = computed({
    get() {
        return `/images/ships/${props.ship.identifier}.jpg`
    }
})

const manufacturerImage = computed({
    get() {
        return `/images/manufacturers/${props.ship.manufacturer}.png`
    }
})

const shipSize = computed({
    get() {
        return ['Micro','Small','Medium','Large','Extra-Large','Capital'][props.ship.size - 1]
    }
})
</script>

<style scoped>
    .ship-summary img {
        max-width: 170px;
        flex-basis: 90%;
        flex-grow: 1;
        align-self: flex-start;
    }

    .ship-summary {
        display: flex;
        flex-grow: 1;
        margin: 10px 0;
        padding: 9px;
        position: relative;
        background: url('@/assets/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-left: 1px solid #546f84;
        border-right: 1px solid #546f84;
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
        z-index: 2;
        flex-grow: 1;
    }

    .ship-info .info {
        display: flex;
        flex-direction: column;
        font-size: 12px;
    }

    .ship-info .info .line-item {
        display: flex;
    }

    .ship-info .info .line-item .label {
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

    .ship-info>h5 {
        font-size: 14px;
    }

    .manufacturer {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100px;
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
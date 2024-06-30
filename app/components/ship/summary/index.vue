<template>
    <panel class="ship-summary" :title="ship.name" titleSize="small">
        <img :src="shipImage" />
        <img class="manufacturer" :src="manufacturerImage" />
        <div class="ship-info">
            <h5></h5>
            <div class="labels">
                <span v-if="ship.owner">Owner:</span>
                <span>Type:</span>
                <span>ID:</span>
                <span>Role:</span>
                <span v-if="ship.crew">Crew:</span>
            </div>
            <div class="data">
                <span v-if="ship.owner">{{ship.owner.name}}</span>
                <span>{{ ship.model }}</span>
                <span>{{ shipID(ship.id)}}</span>
                <span>{{ ship.career }} - {{ ship.role }}</span>
                <span v-if="ship.crew">{{ ship.crew }} / {{ ship.max_crew }}</span>
            </div>
        </div>
        <div class="mask" @click="navigateTo(`/ships/${ship.id}`)"></div>
        <img v-if="isAdmin" title="Remove Ship" class="delete" @click="remove" src="@/assets/delete.png">
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

const emit = defineEmits(['remove'])

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

const citizenLink = computed({
    get() {
        return `/citizens/${props.ship.owner.handle}`
    }
})

async function remove() {
    console.log('removing ship: ', props.ship)
    emit('remove', props.ship)
}
</script>

<style>
    .ship-summary .panel-content {
        display: flex;
    }
</style>

<style scoped>
    .ship-summary img {
        max-width: 170px;
        flex-basis: 90%;
        flex-grow: 1;
        align-self: flex-start;
    }

    .ship-summary {
        display: flex;
        flex-basis: 400px;
        flex-grow: 1;
        max-width: 100vh;
        border-left: 1px solid #546f84;
        border-right: 1px solid #546f84;
        margin: 10px 5px;
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
        margin-left: 10px;
    }

    .ship-info .labels {
        display: flex;
        flex-direction: column;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
        width: 50px;
    }

    .ship-info .data {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 19.5px;
        margin-left: 10px;
        color: #dbf3ff;
    }

    .ship-info>h5 {
        font-size: 14px;
    }

    .manufacturer {
        position: absolute;
        right: 0;
        width: 100px;
        opacity: 0.8;
        z-index: -1;
    }

    .ship-summary .delete {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        z-index: 20;
        cursor: pointer;
    }
</style>
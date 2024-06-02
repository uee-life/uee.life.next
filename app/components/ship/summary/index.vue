<template>
    <div class="ship-summary" :title="ship.model">
        <panel-title v-if="ship.name" :text="ship.name"/>
        <img  @click="selected" :src="shipImage" />
        <img class="manufacturer" :src="manufacturerImage" />
        <div class="ship-info">
            <h5 @click="selected"></h5>
            <div class="labels">
                <span>Ship Type:</span>
                <span>Ship ID:</span>
                <span>Type:</span>
                <span v-if="ship.owner">Owner:</span>
                <span v-if="ship.crew">Crew:</span>
            </div>
            <div class="data">
                <span>{{ ship.model }}</span>
                <span>{{ shipID(ship.id) }}</span>
                <span>{{ ship.career }} - {{ ship.role }}</span>
                <span v-if="ship.owner"><nuxt-link :to="citizenLink">ship.owner.name</nuxt-link></span>
                <span v-if="ship.crew">{{ ship.crew }} / {{ ship.max_crew }}</span>
            </div>
        </div>
        <div class="mask" @click="$emit('selected', ship.id)"></div>
        <span class="corner top left"></span>
        <span class="corner top right"></span>
        <span class="corner bottom left"></span>
        <span class="corner bottom right"></span>
        <img v-if="isAdmin" title="Remove Ship" class="delete" @click="remove" src="@/assets/delete.png">
    </div>
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
/*
export default {
    name: 'ship-summary',
    props: {
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
    },
    computed: {
        ...mapGetters({
            citizen: 'loggedCitizen'
        }),
        shipImage: function() {
            return `/images/ships/${this.ship.short_name}.jpg`
        },
        manufacturerImage: function () {
            return `/images/manufacturers/${this.ship.make_abbr}.png`
        },
        citizenLink: function () {
            return `/citizens/${this.ship.owner.handle}`
        }
    },
    methods: {
        selected() {
            this.$emit('selected', this.ship.id)
        },
        remove() {
            console.log('remove clicked')
            this.$emit('remove', this.ship.id)
        }
    }
}*/
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
        flex-basis: 400px;
        flex-grow: 1;
        margin: 5px;
        padding: 9px;
        position: relative;
        background: url('/images/fading-bars.png') repeat;
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
        margin-left: 10px;
        /*flex-direction: column;
        margin-left: 10px;
        margin-top: -10px;
        z-index: 2;
        flex-grow: 1;*/
    }

    .ship-info .labels {
        display: flex;
        flex-direction: column;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
    }

    .ship-info .data {
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 14px;
        line-height: 19.5px;
        margin-left: 10px;
        color: #dbf3ff;
    }

    /*.ship-info .info {
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
    }*/

    .ship-info>h5 {
        font-size: 14px;
    }

    .manufacturer {
        position: absolute;
        right: 0;
        width: 100px;
        opacity: 0.8;
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
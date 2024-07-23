<template>
    <div v-if="citizen" :class="portraitSize()">
        <nuxt-link :to="citizenLink()">
            <!--img src="@/assets/portrait-bg.png" class="portrait-bg"/-->
            <img :class="imageShape()" :src="citizen.portrait" />
            <img v-if="citizen.verified" class="verified" src="@/assets/verified.png" />
        </nuxt-link>
        <div v-if="showName" class="name">
            {{ citizen.name }}
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    citizen: {
        type: Object,
        required: true
    },
    size: {
        type: String,
        default: 'medium',
        validator: function (value) {
            return ['tiny', 'x-small', 'small', 'medium'].indexOf(value) !== -1
        }
    },
    shape: {
        type: String,
        default: 'square',
        validator: function (value) {
            return ['round', 'square'].indexOf(value) !== -1
        }
    },
    showName: {
        type: Boolean,
        default: false
    }
})

function portraitSize() {
    return `portrait ${props.size} ${props.shape} ${props.citizen.verified ? 'verified' : ''}`
}

function imageShape() {
    return `image ${props.shape}`
}

function citizenLink() {
    return `/citizens/${props.citizen.handle}`
}
</script>

<style scoped>
    .portrait {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .portrait.round.verified {
        background: url("@/assets/portrait-bg.png") top center / cover;
    }

    .portrait a {
        width: 100%;
    }

    .portrait.medium {
        width: 165px;
        flex-basis: 165px;
        height: fit-content;
    }

    .portrait.medium .image {
        width: 165px;
        height: 165px;
    }

    .portrait.small {
        width: 100px;
        min-height: 100px;
        height: fit-content;
        padding: 11px;
    }

    .portrait.small .verified {
        position: absolute;
        top: 68px;
        right: 0px;
        width: 30px;
        filter: drop-shadow(1px 1px 2px black);
    }

    .portrait.x-small {
        width: 85px;
        min-height: 85px;
        height: fit-content;
        padding: 10px;
    }

    .portrait.x-small .verified {
        position: absolute;
        top: 55px;
        right: 8px;
        width: 22px;
        filter: drop-shadow(1px 1px 1px black);
    }

    .portrait.tiny {
        width: 40px;
        min-height: 40px;
        height: fit-content;
        padding: 5px;
    }

    .portrait .image {
        box-sizing: border-box;
        width: 100%;
        vertical-align: middle;
        border: 1px solid #546f84;
    }

    .portrait .image.round {
        border-radius: 50%;
    }

    .portrait.medium .verified {
        position: absolute;
        bottom: 0;
        right: 3px;
        top: 118px;
        width: 45px;
        filter: drop-shadow(2px 2px 2px black);
    }

    .portrait.tiny .verified {
        display: none;
    }

    .portrait.medium .name {
        font-size: 16px;
        text-align: center;
    }
    .portrait.small .name {
        font-size: 12px;
        text-align: center;
    }

    .portrait-bg {
        position:absolute;
        width: 100%;
        top: 0;
        right: -5px;
    }
</style>
<template>
    <div class="avatar">
        <div v-if="citizen" :class="portraitSize()">
            <nuxt-link :to="citizenLink()">
                <div class="avatar">
                    <!--img src="@/assets/portrait-bg.png" class="portrait-bg"/-->
                    <img :class="imageShape()" :src="citizen.portrait" />
                    <img v-if="citizen.verified" class="verified" src="@/assets/verified.png" />
                    <template v-if="showStatus && citizen.verified && citizen.status">
                        <img v-if="citizen.status.active == 'idle'" class="status" title="away" src="@/assets/status-away.png" />
                        <img v-if="citizen.status.active == 'online'" class="status" title="online" src="@/assets/status-online.png" />
                        <img v-if="citizen.status.active == 'offline'" class="status" title="offline" src="@/assets/status-offline.png" />
                    </template>
                </div>
            </nuxt-link>
        </div>
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
        default: 'large',
        validator: function (value) {
            return ['tiny', 'x-small', 'small', 'medium', 'large'].indexOf(value) !== -1
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
    },
    showStatus: {
        type: Boolean,
        default: true
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

    .avatar {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .portrait {
        box-sizing: border-box;
        position: relative;
    }

    .portrait.round.verified {
        background: url("@/assets/portrait-bg.png") top center / cover;
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

    .portrait a {
        width: 100%;
    }

    .status {
        position: absolute;
    } 

    /* Large Image */

    .portrait.large {
        width: 165px;
        flex-basis: 165px;
        height: fit-content;
    }

    .portrait.large.round {
        padding: 11px;
    }

    .portrait.large .image {
        width: 165px;
        height: 165px;
    }

    .portrait.large .verified {
        position: absolute;
        bottom: 0;
        right: 3px;
        top: 118px;
        width: 45px;
        filter: drop-shadow(2px 2px 2px black);
    }

    .portrait.large .status {
        width: 16px;
        top: 5px;
        left: 5px;
    }

    .portrait.large .name {
        font-size: 16px;
        text-align: center;
    }

    /* Medium Image */

    .portrait.medium {
        width: 100px;
        min-height: 100px;
        height: fit-content;
    }

    .portrait.medium.round {
        padding: 11px;
    }

    .portrait.medium .verified {
        position: absolute;
        top: 70px;
        right: 0px;
        width: 30px;
        filter: drop-shadow(1px 1px 2px black);
    }

    .portrait.medium .name {
        font-size: 12px;
        text-align: center;
    }

    .portrait.medium .status {
        width: 13px;
        top: 3px;
        left: 3px;
    }

    /* Small Image */

    .portrait.small {
        width: 85px;
        min-height: 85px;
        height: fit-content;
    }

    .portrait.small.round {
        padding: 10px;
    }

    .portrait.small .verified {
        position: absolute;
        top: 62px;
        right: 2px;
        width: 22px;
        filter: drop-shadow(1px 1px 1px black);
    }

    .portrait.small .status {
        top: 3px;
        left: 3px;
        width: 10px;
    }


    /* Tiny Image */

    .portrait.tiny {
        width: 40px;
        min-height: 40px;
        height: fit-content;
    }

    .portrait.tiny.round {
        padding: 5px;
    }

    .portrait.tiny .verified {
        display: none;
    }

    .portrait.tiny .status {
        top: 2px;
        left: 1px;
        width: 8px;
    }
</style>
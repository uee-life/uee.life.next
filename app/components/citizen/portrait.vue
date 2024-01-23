<template>
    <div v-if="citizen" :class="portraitSize()">
        <nuxt-link :to="citizenLink()">
            <img class="image" :src="citizen.portrait" />
            <img v-if="citizen.verified" class="verified" src="@/assets/verified.png" />
        </nuxt-link>
        <div v-if="showName" class="name">
            {{ citizen.name }}
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
    citizen: {
        type: Object
    },
    size: {
        type: String,
        default: 'medium',
        validator: function (value) {
            return ['tiny', 'small', 'medium'].indexOf(value) !== -1
        }
    },
    showName: {
        type: Boolean,
        default: false
    }
})

function portraitSize() {
    return `portrait ${props.size}`
}

function citizenLink() {
    return `/citizens/${props.citizen.handle}`
}

console.log(props.citizen)

/*export default {
    props: {
        citizen: {
            type: Object
        },
        size: {
            type: String,
            default: 'medium',
            validator: function (value) {
                return ['tiny', 'small', 'medium'].indexOf(value) !== -1
            }
        },
        showName: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        portraitSize() {
            return `portrait ${this.size}`
        },
        citizenLink() {
            return `/citizens/${this.citizen.handle}`
        }
    }
}*/
</script>

<style scoped>
    .portrait {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
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
    }

    .portrait.tiny {
        width: 40px;
        min-height: 40px;
        height: fit-content;
    }

    .portrait .image {
        box-sizing: border-box;
        width: 100%;
        vertical-align: middle;
    }

    .portrait.medium .verified {
        position: absolute;
        bottom: 0;
        right: 3px;
        top: 118px;
        width: 45px;
    }

    .portrait.small .verified {
        position: absolute;
        top: 68px;
        right: 0px;
        width: 30px;
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
</style>
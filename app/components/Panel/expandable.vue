<template>
    <div>
    <panel class="expandable" id="expandablePanel" :title="titleText" :title-size="titleText.length > 0 ? 'medium' : 'no-title'">
        <div :class="contentClass">
            <slot></slot>
        </div>
        
        <div class="expand" @click="toggleExpand()">
            {{ buttonText }}
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </div>
    </panel>
    </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { int } from 'neo4j-driver';

const compUID = useId()

const compUIDName = computed({
    get() {
        return `expandable-${compUID}`
    }
})

const contentClass = computed({
    get() {
        return `content ${compUIDName.value}`
    }
})

const props = defineProps({
    titleText: {
        type: String,
        default: ''
    },
    minSize: {
        type: String,
        default: '30px'
    },
    maxSize: {
        type: String,
        default: 'auto'
    },
    duration: {
        type: int,
        default: 0.5
    },
    openText: {
        type: String,
        default: 'MORE'
    },
    closeText: {
        type: String,
        default: 'LESS'
    }
})

let showing = false
let buttonText = ref(`${props.openText}`)

const toggleExpand = () => {
    if(showing) {
        gsap.to(`.${compUIDName.value}`, {duration: `${props.duration}`, height: `${props.minSize}`})
        buttonText.value = `${props.openText}`
        showing = false
    } else {
        gsap.fromTo(`.${compUIDName.value}`, {height: `${props.minSize}`}, {height: `${props.maxSize}`, duration: `${props.duration}`})
        buttonText.value = `${props.closeText}`
        showing = true
    }
}
</script>

<style scoped>
    .expandable {
        display: flex;
        margin: 10px;
        padding-left: 20px;
        padding-right: 50px;
        padding-bottom: 20px;
    }

    .expand {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
        line-height: 16px;
        padding: 2px 4px 0;
    }

    .content {
        height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .expand:hover {
        color: #dbf3ff;
        cursor: pointer;
    }
</style>
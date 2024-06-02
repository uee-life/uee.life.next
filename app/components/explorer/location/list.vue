<template>
    <div id="location-list" class="location-list">
        <div v-if="locations.length > 0" class="locations">
            <explorer-location-summary v-for="(loc, index) in locations" :key="loc.code" :loc="loc" :link="getLink(loc.code)" :index="index">
                <div>Type: <span class="value">{{ loc.subtype }}</span></div>
                <div>Affiliation: <span class="value">{{ loc.affiliation }}</span></div>
                <div>Habitable: <span class="value">{{ isHabitable(loc) }}</span></div>
            </explorer-location-summary>
        </div>
        <div class="no-locations" v-else>
            No locations found here
        </div>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
    locations: {
        type: Array,
        default: function () {
            return []
        }
    }
})

function getLink(code) {
    return `/discover/${code}`
}

function isHabitable(loc) {
    if(loc.habitable) {
        return "Yes"
    } else {
        return "No"
    }
}

onMounted(() => {
    gsap.to(".location-list", 1, {opacity: 1})
})
</script>

<style scoped>
    .location-list {
        position: relative;
        margin-bottom: 20px;
        margin-left: -5px;
        margin-right: -5px;
        opacity: 1;
    }
    .no-locations {
        text-align: center;
        font-size: 18px;
        color: #dbf3ff;
    }
    .locations {
        display: flex;
        flex-wrap: wrap;
        opacity: 1;
    }

    .value {
        color: #dbf3ff;
    }
</style>
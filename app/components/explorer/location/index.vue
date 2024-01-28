<template>
    <div class="location">
        <panel-main v-if="location" class="location-panel">
            <div class="content">
            <div v-if="location.thumbnail" class="location-image">
                <img :src="location.thumbnail"/>
            </div>
            <div class="location-info">
                <h3 class="title"> {{ location.name }}</h3>
                <p>
                    <span v-if="location.subtype">Type: <span class='value'>{{location.subtype}}</span><br></span>
                    <span v-if="location.affiliation">Affiliation: <span class='value'>{{location.affiliation}}</span><br></span>
                    <span v-if="location.habitable">Habitable: <span class='value'>{{isHabitable}}</span><br></span>
                    <span v-if="location.population">Population: <span class='value'>{{rating(location.population)}}</span><br></span>
                    <span v-if="location.danger">Risk: <span class='value'>{{rating(location.danger)}}</span><br></span>
                </p>
                <p>{{ location.description }}</p>
            </div>
            </div>
        </panel-main>
        <div v-else>Location not found</div>
        <slot></slot>
        <div v-if="debug">{{ JSON.stringify(location, null, 2) }}</div>
    </div>
</template>

<script setup>
import { gsap } from "gsap"
//import { mapGetters } from 'vuex'

const props = defineProps({
    location: {
        type: String
    },
    type: {
        type: String
    }
})

const tabs = ["info", "fleet", "members"]
const initialTab = "info"
const debug = false

const mainTitle = computed({
    get() {
        return `${location.value.name} ${type.value} ( ${location.value.affiliation} )`
    }
})

const isHabitable = computed({
    get() {
        if(this.location.habitable) {
            return 'Yes'
        } else {
            return 'No'
        }
    }
})

function rating(metric) {
    if(metric >= 9) {
        return "Extreme"
    } else if(metric >= 7) {
        return "Very High"
    } else if(metric >= 5) {
        return "Medium"
    } else if(metric >= 3) {
        return "Low"
    } else if(metric >= 1) {
        return "Very Low"
    } else {
        return "None"
    }
}

/*export default {
    computed: {
        ...mapGetters([
            'isMobile'
        ]),
    },
    methods: {
        rating(metric) {
            if(metric >= 9) {
                return "Extreme"
            } else if(metric >= 7) {
                return "Very High"
            } else if(metric >= 5) {
                return "Medium"
            } else if(metric >= 3) {
                return "Low"
            } else if(metric >= 1) {
                return "Very Low"
            } else {
                return "None"
            }
        }
    },
    watch: {
        location: {
            handler: function() {
                gsap.to(".location", 1, {opacity: 1})
                //timeline.to(".portrait", 1, {width: "150px", height: "150px"})
                //timeline.to(".portrait img", 0.5, {opacity: 1})
                //timeline.to(".citizen-info .info", 0.5, {opacity: 1})
            }
        }
    }
}*/
</script>

<style>
    .location {
        width: 100%;
        opacity: 1;
    }

    .location-panel .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .location-image {
        position: relative;
        flex-basis: 300px;
        flex-grow: 1;
        max-width: 400px;  
    }

    .location-image>img {
        width: 100%;
        border: 1px dotted #546f84;
    }

    .location-info {
        margin-bottom: 30px;
        margin: 0 10px;
        flex-grow: 1;
        flex-basis: 200px;
    }

    .location-info .title {
        letter-spacing: 1.5px;
        word-spacing: 3px;
        margin: 10px 0;
    }

    .location-info .value {
        color: #dbf3ff;
    }
</style>
<template>
    <div class="location">
        <layout-banner v-if="location.name"
            :name="location.name"
            :tag="location.designation"
            :type="locationType"
            :image="locationImage" 
            :logo="logoImage" />
        <panel v-if="location" class="location-panel">
            <div class="content">
                <div class="location-info">
                    <h3 class="title"> {{ location.name }}</h3>
                    <p>
                        <span v-if="location.subtype">Type: <span class='value'>{{location.subtype}}</span><br></span>
                        <span v-if="location.affiliation">Affiliation: <span class='value'>{{affiliationText}}</span><br></span>
                        <span v-if="location.habitable">Habitable: <span class='value'>{{isHabitable}}</span><br></span>
                        <span>Population: <span class='value'>{{rating(location.population)}}</span><br></span>
                        <span>Risk: <span class='value'>{{rating(location.danger)}}</span><br></span>
                    </p>
                    <p>{{ location.description }}</p>
                </div>
            </div>
        </panel>
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
        type: Object
    }
})

const tabs = ["info", "fleet", "members"]
const initialTab = "info"
const debug = false

const isHabitable = computed({
    get() {
        if(props.location.value && props.location.value.habitable) {
            return 'Yes'
        } else {
            return 'No'
        }
    }
})

const locationType = computed({
    get() {
        if (props.location.type == "SINGLE_STAR") {
            return "Binary Star System"
        } else {
            return props.location.type
        }
    }
})

const locationImage = computed({
    get() {
        return props.location.image_url ? props.location.image_url : `/images/default/${props.location.type.replace(' ', '_').toLowerCase()}.jpg`
    }
})

const affiliationText = computed({
    get() {
        const affiliations = {
            "UNC": "Unclaimed",
            "XIAN": "Xian",
            "VNCL": "Vanduul",
            "UEE": "UEE",
            "BANU": "Banu",
            "DEV": "Developing"
        }
        return affiliations[props.location.affiliation]
    }
})

const logoImage = computed({
    get() {
        if(["UEE","BANU"].includes(props.location.affiliation)) {
            return `/images/factions/${props.location.affiliation}.png`
        } else {
            return ""
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

onMounted(() => {
    gsap.to(".location", 1, {opacity: 1})
})
</script>

<style>
    .location {
        width: 100%;
        opacity: 0;
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
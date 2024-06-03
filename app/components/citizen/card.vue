<template>
    <div :class="redacted">
        <router-link class="no-decor" :to="citizenLink(citizen.handle)">
            <span class="thumb">
                <img :src="citizen.portrait" />
            </span>
            <span class="identity">
                <h2 class="name">{{citizen.name}}</h2>
                <span class="symbol">{{citizen.handle}}</span>
                <span v-if="citizen.org" class="org">Org: {{citizen.org}}</span>
            </span>
        </router-link>
    </div>
</template>

<script setup>
const props = defineProps({
    citizen: {
        type: Object,
        required: true
    }
})

const redacted = computed({
    get() {
        if (props.citizen.handle == "Redacted") {
            return "result redacted"
        } else {
            return "result"
        }
    }
})

function citizenLink(handle) {
    return `/citizens/${handle}`;
}
</script>

<style scoped>
 .result {
        display: flex;
        flex-grow: 1;
        margin: 5px;
        position: relative;
    }

    .result.redacted {
        background-color: rgba(255,34,34,0.2);
    }

    .result>a {
        display: flex;
        box-sizing: border-box;
        height: 100%;
        align-items: center;
        background: url('/images/fading-bars.png') repeat;
        padding: 5px 10px;
        position: relative;
        height: fit-content;
        border: 1px solid #546f84;
        flex-grow: 1;
    }

    .result.redacted>a {
        border: 1px solid #ff2222;
    }

    .result>a>.thumb {
        display: inline-block;
        width: 70px;
        height: 70px;
        position: relative;
    }

    .result>a>.thumb>img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        align-self: center;
    }

    .result>a>.identity {
        display: flex;
        line-height: 16px;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
    }

    .result>a>.identity>.name {
        margin-top: 0px;
    }

    .result>a>.identity>.org {
        font-size: 0.9rem;
        color: #739cb0;
        margin-top: 2px;
    }

    .result>a>.identity>.symbol {
        font-size: 0.9rem;
        color: #739cb0;
        margin-top: 2px;
    }

    .result>a>.right {
        display: none;
    }
    
    .no-decor {
        text-decoration: none;
    }
</style>
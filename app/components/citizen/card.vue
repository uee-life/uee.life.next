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
            return "card redacted"
        } else {
            return "card"
        }
    }
})

const citizenLink = computed({
    get() {
        return `/citizens/${props.citizen.handle}`;
    }
})
</script>

<template>
    <div :class="redacted" @click="$emit('selected', citizen)">
        <span class="thumb">
            <img :src="citizen.portrait" />
        </span>
        <span class="identity">
            <h2 class="name">{{citizen.name}}</h2>
            <span class="symbol">{{citizen.handle}}</span>
            <span v-if="citizen.org" class="org">[{{citizen.org}}]</span>
        </span>
    </div>
</template>

<style scoped>
.card {
    display: flex;
    flex-grow: 1;
    position: relative;
}

.card.redacted {
    background-color: rgba(255,34,34,0.2);
}

.card.redacted>a {
    border: 1px solid #ff2222;
}

.card {
    display: flex;
    box-sizing: border-box;
    height: 100%;
    align-items: start;
    background: url('@/assets/fading-bars.png') repeat;
    padding: 5px 10px;
    position: relative;
    height: fit-content;
    border: 1px solid #546f84;
    flex-grow: 1;
    cursor: pointer;
}

.card>.thumb {
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
}

.card>.thumb>img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    align-self: center;
}

.card>.identity {
    display: flex;
    line-height: 18px;
    font-size: 0.9rem;
    color: #739cb0;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    margin-top: -5px;
}

.no-decor {
    text-decoration: none;
}
</style>
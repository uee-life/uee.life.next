<template>
    <div class="card-small">
        <router-link class="no-decor" :to="computedLink">
            <span class="thumb">
                <img :src="computedImage" />
            </span>
            <span class="card-data">
                <slot />
            </span>
        </router-link>
    </div>
</template>

<script setup>
const route = useRoute()
const props = defineProps({
    image: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    }
})

const computedLink = computed({
    get() {
        if(props.link === "") {
            return `/${route.name}`
        } else {
            return props.link
        }
    }
})

const computedImage = computed({
    get() {
        if(props.image) {
            return props.image
        } else {
            return "/images/systems/default.jpg"
        }
    }
})
</script>

<style scoped>
.card-small {
    display: flex;
    flex-grow: 1;
    margin: 5px;
}

.card-small>a {
    display: flex;
    background: url('/images/fading-bars.png') repeat;
    padding: 5px;
    position: relative;
    height: fit-content;
    border: 1px solid #546f84;
    flex-grow: 1;
    text-decoration: none;
}

.card-small>a>.left {
    display: flex;
}

.card-small>a>.thumb {
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
}

.card-small>a>.thumb>img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-small>a>.card-data {
    display: flex;
    line-height: 16px;
    max-width: 250px;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    margin-left: 10px;
}

.card-small>a>.card-data>h3 {
    font-size: 14px;
    color: #dbf3ff;
    margin: 0;
}

.verified {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 25px;
}
</style>
<template>
    <panel class="summary" :title="loc.type ? loc.type : ''" titleSize="small">
        <router-link class="summary" :to="link">
            <div v-if="loc.thumbnail" class="thumbnail"><img :src="loc.thumbnail" /></div>
            <div class="summary-info">
                <div><h3 class="summary-name">{{ loc.name }}</h3></div>
                <slot></slot>
            </div>
        </router-link>
    </panel>
</template>

<script setup>
const props = defineProps({
    loc: {
        type: Object
    },
    link: {
        type: String,
        default: ""
    }
})
</script>

<style scoped>
    .thumbnail {
        height: 100px;
        width: 150px;
    }

    .thumbnail>img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border: 1px dotted #546f84;
    }

    .summary {
        display: flex;
        flex-basis: 250px;
        flex-grow: 1;
        margin: 5px;
        text-decoration: none;
        color: inherit;
    }

    .summary-info {
        margin: 0 10px;
        font-size: calc(13px + 3*(100vw - 300px)/1300);
        min-width: 130px;
    }

    .summary-name {
        margin:2px 0;
    }
</style>
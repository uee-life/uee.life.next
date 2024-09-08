<template>
    <panel-dock class="commander-dock" title="Commander" title-size="medium">
        <citizen-portrait :citizen="citizen" :show-name="true"/>
    </panel-dock>
</template>

<script setup>
const props = defineProps({
    citizen: {
        type: Object,
        required: true
    }
})

</script>

<style scoped>
    .commander-dock {
        position: relative;
        height: auto;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
</style>
<template>
    <panel class="fleet-panel" :title="fleet.name" title-size="medium">
        <div class="info">
            <div class="info-item"><span class="label">Purpose:</span><span class="value">{{ fleet.purpose }}</span></div>
            <div class="info-item"><span class="label">Commander:</span><span class="value">{{ fleet.cmdr }}</span></div>
        </div>
        <div class="mask" @click="$emit('selected', fleet)"></div>
    </panel>
</template>

<script setup>
    const props = defineProps({
        fleet: {
            type: Object,
            required: true
        }
    })
</script>

<style scoped>
.mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: pointer;
}
</style>
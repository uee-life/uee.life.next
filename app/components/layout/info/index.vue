<script setup>
const props = defineProps({
    items: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <table class="info-table">
        <tr v-for="(k, v) in items" key="k" class="item">
            <td class="label">{{ v.replace('_', ' ') }}:</td>
            <td class="value">{{ k }}</td>
        </tr>
    </table>
</template>

<style scoped>
.item {
    line-height: 14px;
}

.item>.label {
    text-transform: uppercase;
    font-family: 'Michroma';
    font-size: 12px;
    padding-right: 10px;
    vertical-align: top;
}

.item>.value {
    color: #dbf3ff;
    font-size: 14px;
}
</style>
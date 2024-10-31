<script setup>
const props = defineProps({
    items: {
        type: Object,
        required: true
    },
    icons: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
</script>

<template>
    <ClientOnly>
    <table class="info-table">
        <tr v-for="(v, k) in items" key="k" class="item">
            <td class="icon"><img v-if="icons[k]" :src="`/images/icons/${icons[k]}.png`"/></td>
            <td class="label">{{ k.replace('_', ' ') }}</td>

            <td class="value">{{ v }}<slot :name="k"></slot></td>
        </tr>
    </table>
    </ClientOnly>
</template>

<style scoped>
.item {
    line-height: 13px;
    vertical-align: top;
}

.item>.label {
    text-transform: uppercase;
    font-family: 'Michroma';
    font-size: 11px;
    padding-right: 10px;
    padding-top: 2px;
}

.item>.value {
    color: #dbf3ff;
    font-size: 13px;
    padding-top: 2px;
}

.icon>img {
    max-width: 18px;
}
</style>
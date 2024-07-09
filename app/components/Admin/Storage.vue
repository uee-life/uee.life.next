<script setup>
import { format } from 'date-fns'
const {data, status} = useAPI(`/api/admin/storage`)

function isValid(date) {
    if (new Date(date) > new Date()) {
        return true
    }
    return false
}
</script>

<template>
    <panel title="Cached Data" class="cache">
        <div v-if="status == 'success'"class="cache">
            <div v-for="(value, key) in data" :key="key">
                <div>Key: {{ key }}</div>
                <div>Expires: {{ new Date(value.expires).toLocaleString() }} - {{ value.expires }}</div>
                <div>Status: {{ isValid(value.expires) ? 'Valid' : 'Expired' }}</div>
            </div>
        </div>
    </panel>
</template>

<style scoped>
.cache {
    display: flex;
    flex-direction: column;
    text-overflow: wrap;
    max-width: calc(100vw - 250px);
}
</style>
<script setup>
import { format } from 'date-fns'
const {data, status, refresh} = useAPI(`/api/admin/cache`)
</script>

<template>
    <div class="storage">
        <panel-title text="Cached Data" size="large" class="title"/>
        <template v-if="status == 'success'">
            <admin-cache-item v-for="(value, key) in data" :key="key" :name="key" :value="value" @refresh="refresh">
            </admin-cache-item>
        </template>
    </div>
</template>

<style scoped>

.storage {
    position: relative;
    display: flex;
    flex-direction: column;
}

.storage>.title {
    position: relative;
    margin-top: 10px;
}
.cache {
    display: flex;
    flex-direction: column;
    text-overflow: wrap;
    max-width: calc(100vw - 250px);
}
</style>
<script setup>
const { $api } = useNuxtApp()

const { data, status, refresh } = await useAPI(`/api/assignments`)
</script>

<template>
    <widgets-loading v-if="status != 'success'"></widgets-loading>
    <div v-else>
        <assignment-summary-small v-if="data.data.length > 0" v-for="ass in data.data" :assignment="ass">
        </assignment-summary-small>
        <widgets-no-result v-else text="No Assignments Found" />
    </div>
</template>
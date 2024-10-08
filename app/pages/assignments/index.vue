<script setup>
const { $api } = useNuxtApp()

const { data, status, refresh } = await useAPI(`/api/assignments`)
</script>

<template>
    <widgets-loading v-if="status == 'pending'"></widgets-loading>
    <div v-if="status == 'success'">
        <assignment-summary v-if="data.data.length > 0" v-for="ass in data.data" :assignment="ass">
        </assignment-summary>
        <widgets-no-result v-else text="No Assignments Found" />
    </div>
</template>
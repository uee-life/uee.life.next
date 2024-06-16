<template>
    <widgets-loading v-if="pending" />
    <ship v-else :ship="data" />
</template>

<script setup>
const route = useRoute()

const {pending, data} = await useFetch(`/api/ship/${route.params.id}`, {
    key: 'getShip'
})

</script>

<style>

</style>
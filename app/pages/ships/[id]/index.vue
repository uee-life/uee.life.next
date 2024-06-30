<template>
    <widgets-loading v-if="pending" />
    <ship v-else-if="response.status == 'success'" :ship="response.data" />
    <widgets-no-result v-else text="Ship not found" />
</template>

<script setup>
const route = useRoute()

const {pending, data: response} = await useFetch(`/api/ship/${route.params.id}`, {
    key: 'getShip'
})

</script>

<style>

</style>
<template>
    <widgets-loading v-if="status != 'success'" />
    <ship v-else-if="response.status == 'success'" :ship="response.data" />
    <widgets-no-result v-else text="Ship not found" />
</template>

<script setup>
const route = useRoute()

const {status, data: response} = useAPI(`/api/ships/${route.params.id}`, {
    key: 'getShip'
})

</script>

<style>

</style>
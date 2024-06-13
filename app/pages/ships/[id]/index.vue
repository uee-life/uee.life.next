<template>
    <ship :id="ship_id" />
</template>

<script setup>
const route = useRoute()

const ship_id = ref(parseID(route.params.id))

function parseID (ship_id) {
    return parseInt(ship_id.split('-')[1], 16)
}

</script>

<style>

</style>
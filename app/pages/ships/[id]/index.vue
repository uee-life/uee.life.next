<template>
    <widgets-loading v-if="status != 'success'" />
    <div v-else-if="response.status == 'success'">
        <layout-banner 
            :name="response.data.model"
            :tag="response.data.name"
            :type="response.data.career + ' / ' + response.data.role"
            :image="`/images/ships/${response.data.identifier}.jpg`"
            :logo="`/images/manufacturers/${response.data.manufacturer}.png`"/>
        <ship  :ship="response.data" />
    </div>
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
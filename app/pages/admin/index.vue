<template>
    <div class="main">
        <div class="content">
          Admin Page
          <ship-summary-model v-if="shipModels" v-for="ship in shipModels.ships" :ship="ship"/>
        </div>
    </div>
</template>

<script setup>
const {data: shipModels} = await useFetch('/api/ship/models', {
    key: 'getShipModels',
    server: false,
    lazy: true,
})
</script>

<style>

.main {
  display: flex;
  flex-wrap: wrap;
  max-width: 2000px;
  margin: auto;
}

.content {
  margin: 0 10px;
  flex-grow: 1;
  flex-basis: 300px;
}
 
</style>
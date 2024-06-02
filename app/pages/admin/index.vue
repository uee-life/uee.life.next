<template>
    <div class="main">
        <div class="content">
          Admin Page
          <ship-summary-model v-if="shipModels" v-for="ship in shipModels" :ship="ship"/>
          {{ shipModels }}
        </div>
    </div>
</template>

<script setup>
const shipModels = ref([])

await useFetch('/api/ship/models', {
    key: 'getShipModels',
    server: false,
    lazy: true,
    async onResponse(_ctx) {
      shipModels.value = _ctx.response._data
    }
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
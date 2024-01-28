<template>
    <div>
        <div v-for="sys in systems" ><nuxt-link :to="`/systems/${sys.name}`">{{sys.name}} System</nuxt-link></div>
    </div>
  </template>
  
  <script setup>
  const systems = ref([])

  await useFetch(`/api/explore/systems`, {
    key: 'getSystems',
    server: false,
    lazy: true,
    async onResponse(_ctx) {
        console.log(_ctx.response._data)
        systems.value = _ctx.response._data
    }
  })
  </script>
  
  <style>
  .layout-enter-active,
  .layout-leave-active {
    transition-property: opacity;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;
  }
  .layout-enter,
  .layout-leave-to {
    opacity: 0;
  }
  </style>
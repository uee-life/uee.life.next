<template>
    <div>
        <layout-card-small v-for="sys in systems" :image="sys.image_url">
          <h2>{{sys.name}} System</h2>
        </layout-card-small>
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
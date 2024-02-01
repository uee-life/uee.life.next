<template>
    <div class="system-list">
        <explorer-location-summary v-for="sys in systems" :link="`/systems/${sys.code}`" :loc="{thumbnail: sys.image_url, name: sys.name}">
          <!--h2>{{sys}}</h2-->
        </explorer-location-summary>
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

  .system-list {
    display: flex;
    flex-wrap: wrap;
    flex-basis: fit-content;
    margin-left: -5px;
    margin-right: -5px;
  }
  </style>
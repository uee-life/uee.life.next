<template>
    <div :id="name" class="banner">
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    name: String
  })
  </script>
    
  <style scoped>
  .banner {
      position: relative;
      width: 100%;
  }
  </style>
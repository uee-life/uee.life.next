<template>
    <div class="dock">
      <div :id="name"></div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    name: String
  })
  </script>
  
  <style>
      .dock {
          width: fit-content;
          margin: 0 10px;
          position: relative;
      }
  </style>
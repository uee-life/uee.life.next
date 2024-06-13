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
  
<style scoped>
.dock {
    position: relative;
    width: fit-content;
    padding-top: 10px;
}
</style>
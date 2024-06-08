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
    width: fit-content;
    position: relative;
}
</style>
<template>
  <div :id="name" class="dock">
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
}
</style>
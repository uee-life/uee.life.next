<script setup>
</script>

<template>
    <div class="main">
        <layout-dock name="left-dock" />
        <div class="content">
            <slot />
        </div>
        <layout-dock name="right-dock"/>
    </div>
</template>

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
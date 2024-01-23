<template>
  <div>
    <NuxtLayout v-if="$viewport.isLessThan('tablet')" name="default">
      <NuxtPage />
    </NuxtLayout>
    <NuxtLayout v-else name="default">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app';
const { $viewport } = useNuxtApp()
</script>
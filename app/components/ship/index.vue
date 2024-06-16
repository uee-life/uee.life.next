<template>
    <div>
        {{ ship }}
    </div>
</template>

<script setup>
const props = defineProps({
    ship: {
        type: Object,
        required: true
    }
})
</script>
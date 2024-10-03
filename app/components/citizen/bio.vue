<script setup>
defineProps({
    bio: {
        type: String
    }
})
</script>

<template>
    <panel title="bio" titleSize="small">
        {{ bio }}
    </panel>
</template>
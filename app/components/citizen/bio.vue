<template>
    <panel title="bio" titleSize="small">
        {{ bio }}
    </panel>
</template>

<script setup>
defineProps({
    bio: {
        type: String
    }
})
</script>
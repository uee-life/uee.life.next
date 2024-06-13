<template>
    <panel class="panel-button">
        {{ text }}
    </panel>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<style>
.panel-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: 'Michroma';
    font-size: 12px;
    text-transform: capitalize;
    max-width: 100vh;
    border-left: 1px solid #546f84;
    border-right: 1px solid #546f84;
}
.panel-button:hover {
    color: #dbf3ff;
}
</style>
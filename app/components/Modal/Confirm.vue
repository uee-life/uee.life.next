<script setup>
const props = defineProps({
    text: {
        type: String,
        default: 'This cannot be undone!'
    }
})
</script>

<template>
    <layout-modal title="Are you sure?" :show-close="false">
        <div class="message">{{ text }}</div>
        <div class="confirm">
            <img class="button" src="@/assets/tick.png" @click="$emit('confirm')">
            <img class="button" src="@/assets/delete.png"  @click="$emit('cancel')">
        </div>
    </layout-modal>   
</template>

<style scoped>
.message {
    color: #dbf3ff;
}

.confirm {
    display: flex;
    width: 200px;
    align-items: center;
    justify-content: center;
}

.confirm>.button {
    margin: 10px;
    width: 50px;
    cursor: pointer;
}
</style>
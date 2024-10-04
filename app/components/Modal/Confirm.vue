<script setup></script>

<template>
    <layout-modal title="Are you sure?" :show-close="false">
        <div class="message">This cannot be undone!</div>
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
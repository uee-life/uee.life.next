<script setup>
const { $api } = useNuxtApp()
const emit = defineEmits(['success', 'error'])

const createAccount = async (data) => {
    console.log('creating account', data)
    const result = await $api(`/api/user/create`, {
        method: 'POST',
        body: data
    })
    if (result.status == 'success') {
        emit('success', result.data)
    } else {
        emit('error', result.data)
    }
}

</script>

<template>
    <layout-modal title="Register Account" :show-close="true">
        <forms-user @submit="createAccount"></forms-user>
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
<script setup>
const { $api } = useNuxtApp()
const emit = defineEmits(['done'])

const status = ref({
    state: 'pending',
    text: ''
})

const createAccount = async (data) => {
    const result = await $api(`/api/user/create`, {
        method: 'POST',
        body: data
    })
    if (result.status == 'success') {
        status.value.state = 'success'
        status.value.text = result.data
    } else {
        status.value.state = 'error'
        status.value.text = result.data
    }
}

const allDone = () => {
    emit('done')
}

</script>

<template>
    <layout-modal title="Register Account" :show-close="true">
        <forms-user v-if="status.state == 'pending'" @submit="createAccount"></forms-user>
        <div v-else-if="status.state == 'success'">{{ status.text }}!</div>
        <div v-else-if="status.state == 'error'">{{ status.text }}</div>
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
<template>
    <form @submit.prevent="registerUser" class="user-form">
        <table>
            <tr>
                <td>Invite Code:</td>
                <td><input class="input" type="text" v-model="data.code"></td>
            </tr>
            <tr>
                <td>Email:</td>
                <td><input class="input" type="text" v-model="data.email"></td>
            </tr>
        </table>
        <forms-input-citizen @selected="selected"/>
        <input type="submit" value="Add" :class="canSubmit" />
    </form>
</template>

<script setup>
const { $api } = useNuxtApp()
const emit = defineEmits(['submit'])

const data = ref({
    code: '',
    email: '',
    handle: ''
})

//TODO: Add proper email validation here
const canSubmit = computed({
    get() {
        if (checkFields.value) {
            return "submit active"
        } else {
            return "submit deactivated"
        }
    }
})

const checkFields = computed({
    get() {
        if (data.value.handle.length > 0 && data.value.code.length > 0 && data.value.email.length > 0) {
            return true
        } else {
            return false
        }
    }
})

const selected = (citizen) => {
    data.value.handle = citizen.handle
}

const registerUser = () => {
    if (checkFields.value) {
        emit('submit', data.value)
    }
}
</script>

<style>
.user-form {
    display: flex;
    flex-direction: column;
    width: 400px;
    max-width: 400px;
    padding: 15px;
}

.input {
    width: 100%;
}

.submit {
    margin-top: 10px;
}

input {
    margin-bottom: 5px;
}

input.active {
    cursor: pointer;
}

input.deactivated {
    cursor: not-allowed;
    opacity: 0.2;
}
</style>
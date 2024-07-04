<template>
    <panel title="Verify Account" class="settings-verify">
        <div>
            <h3>Welcome to UEE.life!</h3>
            <p>To verify your account, copy the unique code from below, then paste it into your <a href="https://robertsspaceindustries.com/account/profile">RSI account bio</a>!</p>
            <p>Once done, return here and click on the "verify" button to complete verification.</p>
            <p>Not sure you have the right handle? Check your <a href="https://robertsspaceindustries.com/account/settings">RSI Profile</a></p>
            <p class="verify-code">
                <input type="text" :value="verificationCode" readonly>
                <button @click="$emit('verify')">Verify</button>
                <span v-if="errors" class="error">FAILED: {{errors}}</span>
            </p>        
        </div>
    </panel>
</template>

<script setup>

const props = defineProps({
    account: {
        type: Object,
        required: true
    },
    errors: {
        type: String,
        default: ""
    }
})

const verificationCode = computed({
    get() {
        return `[ueelife:${props.account.app_metadata.verificationCode}]`
    }
})



</script>

<style scoped>
.settings-verify {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    padding: 10px;
    margin-top: 10px;
}

.settings-verify input {
    color: #dbf3ff;
    background: none;
    width: 450px;
}
.verify-code {
    display: flex;
    flex-wrap: wrap;
    align-self: center;
}
.verify-code>button {
    margin-left: 5px;
    padding: 10px;
    color: #39CED8;
    background-color: rgb(13, 46, 66);
    border: none;
    cursor: pointer;
}
.verify-code>span {
    margin-left: 15px;
    align-self: center;
    color: red;
}
</style>
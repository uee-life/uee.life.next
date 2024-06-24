<template>
    <panel title="Verify Account">
        <h3>Welcome to UEE.life!</h3>
        <p>To verify your account, copy the unique code from below, then paste it into your <a href="https://robertsspaceindustries.com/account/profile">RSI account bio</a>!</p>
        <p>Once done, return here and click on the "verify" button to complete verification.</p>
        <p>Not sure you have the right handle? Check your <a href="https://robertsspaceindustries.com/account/settings">RSI Profile</a></p>
        <p class="verify-code">
            <input type="text" :value="verificationCode" readonly>
            <button @click="$emit('verify')">Verify</button>
            <span v-if="errors" class="error">FAILED: {{errors}}</span>
        </p>
    </panel>
</template>

<script setup>

const props = defineProps({
    errors: {
        type: String,
        default: ""
    }
})

const user = useUser()

// temporary for testing
const vCode = "foobar"

const verificationCode = computed({
    get() {
        return `[ueelife:${vCode}]`
    }
})



</script>
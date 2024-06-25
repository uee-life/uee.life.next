<template>
    <div class="settings">
        <widgets-loading v-if="status == 'pending'" />
        <template v-if="user">
            <settings-verify class="settings-panel" v-if="!user.verified || debug" :errors="errors.verification" @verify="verifyAccount" />
            <settings-info class="settings-panel" @refresh="refresh" />
            <panel class="settings-panel" title="Settings">More coming soon...</panel>
        </template>
        <div v-if="debug" class="debug">
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['user']
})

const debug = ref(true)
const user = useUser()
const errors = ref({
    verification: ""
})
const status = ref("test")

const verifyAccount = () => {
    console.log('Verifying account')
}

const refresh = () => {
    console.log('placeholder')
}

</script>

<style scoped>
  .settings {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: center;
    margin-top: 10px;
  }



</style>
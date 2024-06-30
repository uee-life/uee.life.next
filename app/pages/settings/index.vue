<template>
    <div class="settings">
        <widgets-loading v-if="status == 'pending'" />
        <template v-else>
            <settings-verify :account="account" class="settings-panel" v-if="!account.verified || debug" :errors="errors.verification" @verify="verifyAccount" />
            <settings-info :account="account" class="settings-panel" @refresh="refresh" />
            <panel class="settings-panel" title="Settings">More coming soon...</panel>
        </template>
        <div v-if="debug" class="debug">
            <pre>{{ JSON.stringify(account, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['authenticated']
})

const debug = ref(false)
const user = useUser()
const errors = ref({
    verification: ""
})

const verifyAccount = async () => {
    console.log('Verifying account')
    const result = await $fetch(`/api/user/verify`, {
        key: 'verifyAccount',
        method: 'POST'
    })
    await refresh()
}

const { data: account, status, refresh } = await useFetch(`/api/user/account`, {
    key: 'getAccount'
})

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
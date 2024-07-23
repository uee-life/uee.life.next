<script setup>
const { $api } = useNuxtApp()

const debug = ref(true)
const errors = ref({
    verification: ""
})

const verifyAccount = async () => {
    console.log('Verifying account')
    const result = await $api(`/api/user/verify`, {
        key: 'verifyAccount',
        method: 'POST'
    })
    await refresh()
    reloadNuxtApp()
}

const { data: account, status, refresh } = await useAPI(`/api/user/account`)

</script>

<template>
    <div class="settings">
        <widgets-loading v-if="status == 'pending'" />
        <template v-else>
            <settings-verify :account="account.data" class="settings-panel" v-if="!account.data.app_metadata.handle_verified || debug" :errors="errors.verification" @verify="verifyAccount" />
            <settings-info :account="account.data" class="settings-panel" @refresh="refresh" />
            <panel class="settings-panel" title="Settings">More coming soon...</panel>
        </template>
        <div v-if="debug" class="debug">
            <pre>{{ JSON.stringify(account, null, 2) }}</pre>
        </div>
    </div>
</template>

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
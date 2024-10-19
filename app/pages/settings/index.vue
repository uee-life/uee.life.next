<script setup>
const { $api } = useNuxtApp()

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

const { data: account, status, refresh } = useAPI(`/api/user/account`)

</script>

<template>
    <div class="settings">
        <widgets-loading v-if="status == 'pending'" />
        <template v-else>
            <settings-verify :account="account.data" class="settings-panel" v-if="!account.data.app_metadata.handle_verified" :errors="errors.verification" @verify="verifyAccount" />
            <settings-info :account="account.data" class="settings-panel" @refresh="refresh" />
            <panel class="settings-panel" title="Settings" title-size="small">More coming soon...</panel>
        </template>
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
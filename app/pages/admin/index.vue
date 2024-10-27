<script setup>
const { $api } = useNuxtApp()
const result = ref('')

const handle = ref('')

const syncUser = async () => {
    await $api(`/api/admin/user/sync`, {
        method: 'POST',
        body: {
            handle: handle.value
        }
    })
}
</script>

<template>
    <div class="main">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="Pages">
                    <div class="left-nav-button">
                        <nuxt-link to="/admin/ships">Ship Admin</nuxt-link>
                    </div>
                    <div class="left-nav-button">
                        <nuxt-link to="/admin/RSIData">RSI Admin</nuxt-link>
                    </div>
                    <div class="left-nav-button">
                        <nuxt-link to="/admin/Cache">Cache Admin</nuxt-link>
                    </div>
                    <div class="left-nav-button">
                        <nuxt-link to="/admin/Codes">Code Admin</nuxt-link>
                    </div>
                </panel-dock>
                <panel-dock class="actions" title="Global Actions">
                    <div>Handle: <input v-model="handle" /></div>
                    <div class="left-nav-button" @click="syncUser">
                        Sync User
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <panel title="Site Data" title-size="small">
            Coming soon...
        </panel>
        <panel title="Action Output" titleSize="small">
            {{ result }}
        </panel>
    </div>
</template>

<style scoped>

.main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding-top: 20px;
}
 
</style>
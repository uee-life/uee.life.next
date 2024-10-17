<script setup>
const { $api } = useNuxtApp()
const count = ref(5)

const generateCodes = async () => {
    await $api(`/api/admin/codes/generate`, {
        method: 'POST',
        body: {
            count: count.value
        }
    })
    refresh()
    // todo
}

const {data, status, refresh} = useAPI('/api/admin/codes', {
    key: 'getVehicleModels',
    server: false,
    lazy: true,
})
</script>

<template>
    <widgets-loading v-if="status != 'success'"></widgets-loading>
    <div v-else>
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div>count: <input v-model="count"/></div>
                    <div class="left-nav-button" @click="generateCodes">
                        Generate Codes
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <panel title="Active Codes" title-size="small" class="codes"><span v-for="c in data.data">{{ c.code }},</span></panel>
    </div>
</template>

<style scoped>
.codes {
    padding: 15px;
}
</style>
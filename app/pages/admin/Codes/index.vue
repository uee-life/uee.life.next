<script setup>
const { $api } = useNuxtApp()
const count = ref(5)
const org = ref('')

const isPrinted = (code) => {}

const generateOrgCode = async () => {
    await $api(`/api/admin/codes/generate`, {
        method: 'POST',
        body: {
            org: org.value
        }
    })
    refresh()
}

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
                    <div>Org ID: <input v-model="org" /></div>
                    <div class="left-nav-button" @click="generateOrgCode">
                        Generate Org Code
                    </div>
                    <div>count: <input v-model="count"/></div>
                    <div class="left-nav-button" @click="generateCodes">
                        Generate Codes
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <panel title="Org Codes" title-size="small" class="codes">
            <span v-for="c in data.data.org">{{ c }}, </span>
        </panel>
        <panel title="Active Codes" title-size="small" class="codes"><span v-for="c in data.data.standard" :class="c.issued ? 'issued' : ''">{{ c.code }},</span></panel>
        <panel title="Assigned Codes" title-size="small" class="codes">

        </panel>
    </div>
</template>

<style scoped>
.codes {
    padding: 15px;
}

.issued {
    color: gray;
}
</style>
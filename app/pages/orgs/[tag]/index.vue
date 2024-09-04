<script setup>
const { $api } = useNuxtApp()

const auth = useAuthStore()
const route = useRoute()

const tabs = ["info", "ships", "fleets", "members", "affiliates"]
const initialTab = "info"
const fleet = ref([])

const spectrumLink = computed({
    get() {
        return `https://robertsspaceindustries.com/spectrum/community/${org.data.tag}`
    }
})

const isOwner = computed({
    get() {
        if (status != 'pending') {
            return auth.isAuthenticated && !!org.value.data.founders.find(item => item.handle === auth.citizen.handle)
        } else {
            return false
        }
    }
})

async function getOrgShips() {
    fleet.value = await $api(`/api/orgs/${route.params.tag}/ships`, {
        async onResponse({ response }) {
            fleet.value = response.data
        }
    })
    console.log(fleet.value)
}

const {status, data: org} = useAPI(`/api/orgs/${route.params.tag}`, {
    key: 'getOrg',
    async onResponse(_ctx) {
        await getOrgShips()
    }
})

</script>

<template>
    <div class="org-main" id="org-main">
        <div class="loading" v-if="status != 'success'">
            <img src="@/assets/loading.gif" >
        </div>
        <template v-else-if="org.data">
            <layout-banner 
                :name="org.data.name"
                :tag="org.data.tag"
                :type="org.data.model.toUpperCase()"
                :image="org.data.banner"
                :logo="org.data.logo" />
            <div class="org-tabs">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template #tab-title-info>
                        INFO
                    </template>
                    <template #tab-content-info>
                        <org-content v-if="org.data.description" :content="org.data.description" :centered="true"></org-content>
                        <org-overview :org="org.data" />
                        <org-info :org="org.data" :isOwner="isOwner"/>
                    </template>

                    <template #tab-title-ships>
                        SHIPS
                    </template>
                    <template #tab-content-ships>
                        <ship-collection :ships="fleet.data" view="small" :showSummary="true" />
                    </template>

                    <template #tab-title-fleets>
                        FLEETS
                    </template>
                    <template #tab-content-fleets>
                        <org-fleet :org="org.data" :isOwner="isOwner" />
                    </template>

                    <template #tab-title-members>
                        MEMBERS
                    </template>
                    <template #tab-content-members>
                        <org-members />
                    </template>

                    <template #tab-title-affiliates>
                        AFFILIATES
                    </template>
                    <template #tab-content-affiliates>
                        <org-members :affiliate="true"/>
                    </template>
                </layout-tabs>
            </div>
        </template>
        <widgets-no-result v-else />
    </div>
</template>

<style scoped>
</style>
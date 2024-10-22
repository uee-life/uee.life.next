<script setup>
const { $api } = useNuxtApp()

const auth = useAuthStore()
const route = useRoute()

const tabs = ["info", "organization", "vehicles", "fleets", "members", "affiliates"]

const initialTab = ref("info")

const fleet = ref([])

const spectrumLink = computed({
    get() {
        return `https://robertsspaceindustries.com/spectrum/community/${org.data.id}`
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
    fleet.value = await $api(`/api/orgs/${route.params.id}/vehicles`, {
        async onResponse({ response }) {
            //console.log(response)
            //fleet.value = response.data
        }
    })
    console.log(fleet.value)
}

const {status, data: org} = useAPI(`/api/orgs/${route.params.id}`, {
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
            <!--client-only>
                <teleport to="#left-dock">
                    <panel-dock title="Online Members" >
                        <org-online :org="org.data"/>
                    </panel-dock>
                </teleport>
            </client-only-->
            <layout-banner 
                display="full"
                :name="org.data.name"
                :tag="org.data.id"
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

                    <template #tab-title-organization>
                        ORG CHART
                    </template>
                    <template #tab-content-organization>
                        <org-organization :org="org.data"/>
                    </template>

                    <template #tab-title-vehicles>
                        VEHICLES
                    </template>
                    <template #tab-content-vehicles>
                        <vehicle-collection :vehicles="fleet.data" view="small" :showSummary="true" />
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
<template>
    <div class="org-main" id="org-main">
        <div class="loading" v-if="pending">
            <img src="@/assets/loading.gif" >
        </div>
        <template v-else-if="org.tag">
            <layout-banner 
                :name="org.name"
                :tag="org.tag"
                :type="org.model.toUpperCase()"
                :image="org.banner"
                :logo="org.logo" />
            <org-content v-if="org.description" :content="org.description" :centered="true"></org-content>
            <org-overview :org="org" />
            <div class="org-tabs">
                <layout-tabs :tabs="tabs" :initialTab="initialTab">
                    <template #tab-title-about>
                        INFO
                    </template>
                    <template #tab-content-about>
                        <org-info :org="org" :isOwner="isOwner"/>
                    </template>

                    <template #tab-title-ships>
                        SHIPS
                    </template>
                    <template #tab-content-ships>
                        <fleet-view :ships="fleet" view="small" :showSummary="true" />
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

<script setup>
const route = useRoute()

const tabs = ["about", "ships", "members", "affiliates"]
const initialTab = "about"
const org = ref({})
const fleet = ref([])


const {pending} = await useFetch(`/api/org/${route.params.tag}`, {
    key: 'getOrg',
    server: false,
    lazy: true,
    async onResponse(_ctx) {
        org.value = _ctx.response._data
        await getOrgShips()
    },
    async onResponseError(_ctx) {
        console.log(_ctx.response.statusText)
    }
})

const spectrumLink = computed({
    get() {
        return `https://robertsspaceindustries.com/spectrum/community/${org.tag}`
    }
})

const isOwner = computed({
    get() {
        /*
        const owners = []
        for (let f in this.org.founders) {
            owners.push(this.org.founders[f].handle)
        }
        return !!this.$auth.user && owners.includes(this.$auth.user.app_metadata.handle)
        */
       return true
    }
})

async function getOrgShips() {
    fleet.value = await $fetch(`/api/org/${route.params.tag}/ships`)
}

</script>

<style scoped>
</style>
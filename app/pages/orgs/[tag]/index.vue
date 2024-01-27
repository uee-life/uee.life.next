<template>
    <div class="org-main" id="org-main">
        <div class="loading" v-if="pending">
            <img src="@/assets/loading.gif" >
        </div>
        <template v-else-if="found">        
            <org-banner v-if="org" :org="org"></org-banner>
            <org-overview :org="org" />
            <org-content v-if="org.intro" :content="org.intro" :centered="true"></org-content>
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

const pending = ref(true)
const found = ref(false)

await useFetch(`/api/org/${route.params.tag}`, {
    key: 'getOrg',
    server: false,
    lazy: true,
    async onResponse(_ctx) {
        org.value = _ctx.response._data
        found.value = true
        pending.value = false
    },
    async onResponseError(_ctx) {
        console.log(_ctx.response.statusText)
        found.value = false
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

}

</script>

<style scoped>
    .no-results {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .no-results>.text {
        position: relative;
        width: fit-content;
        padding-left: 20px;
        padding-right: 20px;
        margin: 20px;
    }

    .no-results>.text.big {
        font-family: 'Michroma';
        font-size: 25px;
    }
</style>
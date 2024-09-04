<template>
    <widgets-loading v-if="status != 'success'" />
    <widgets-no-result v-else-if="fleet.status == 'error'" :text="fleet.data"/>
    <div v-else class="fleet">
        <!--ClientOnly>
            <teleport to="#right-dock">
                <citizen-org :org="fleet.data.org"></citizen-org>
                <fleet-commander :citizen="fleet.data.cmdr"></fleet-commander>
            </teleport>
        </ClientOnly-->
        <nuxt-link :to="orgLink">
            <layout-banner 
                :name="fleet.data.org.name"
                :tag="fleet.data.info.name"
                :type="fleet.data.info.purpose"
                image="/images/default/fleet.jpg"
                :logo="fleet.data.org.logo" />
        </nuxt-link>
        <panel title="Fleet Hierarchy" class="fleet-chart">
            <client-only>
                <layout-chart-fleet :datasource="fleet.data" :selected="selected" @setSelected="setSelected"/>
            </client-only>
        </panel>
        <fleet-group :groupID="selected" @refresh="refresh" @reset="reset"></fleet-group>
    </div>
</template>

<script setup>
    const { $api } = useNuxtApp()
    const route = useRoute()
    
    const fleetData = ref({})
    const selected = ref(route.params.id)

    const orgLink = computed({
        get() {
            if(status == 'success') {
                return `/orgs/${fleet.data.org.tag}`
            }
            return ''
        }
    })

    const setSelected = (id) => {
        console.log('setting selected to: ' + id)
        selected.value = id
    }

    const reset = () => {
        selected.value = route.params.id
        refresh()
    }

    const {status, data: fleet, refresh} = useAPI(() => `/api/fleets/${route.params.id}`, {
        key: 'getFleet'
    })
</script>
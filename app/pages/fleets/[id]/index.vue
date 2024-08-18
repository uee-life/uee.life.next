<template>
    <widgets-loading v-if="status != 'success'" />
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
            <layout-chart-fleet :datasource="fleet.data" :selected="selected"/>
        </panel>
        <fleet-group :groupID="selected"></fleet-group>
    </div>
</template>

<script setup>
    const route = useRoute()
    

    const chart = ref({})
    const selected = ref(route.params.id)

    const orgLink = computed({
        get() {
            if(status == 'success') {
                return `/orgs/${fleet.data.org.tag}`
            }
            return ''
        }
    })

    const getSubGroups = async (groupID) => {
        
    }

    const {status, data: fleet, refresh} = await useAPI(() => `/api/fleets/${selected.value}`)
</script>
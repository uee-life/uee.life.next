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
                display="content"
                :name="fleet.data.org.name"
                :tag="fleet.data.info.name"
                :type="fleet.data.info.purpose"
                image="/images/default/fleet.jpg"
                :logo="fleet.data.org.logo" 
                @clicked="console.log('CLICKED')"/>
        </nuxt-link>
        <panel class="fleet-chart" title="Fleet Hierarchy" title-size="small">
            <client-only>
                <layout-chart-fleet :datasource="fleet.data" :selected="selected" @setSelected="setSelected"/>
            </client-only>
        </panel>
        <fleet-group 
            :fleet="fleet.data"
            :is-admin="isAdmin"
            :selected="selected"
            :vehicle-pool="vehiclePool"
            @refresh="refresh" 
            @reset="reset" 
            @return="navigateTo(`/orgs/${fleet.data.org.id}`)">
            <template v-slot:assignment>
                <panel style="margin:10px; text-align: center;" title="Assignment" title-size="small">Log in to view assignment</panel>
            </template>
        </fleet-group>
    </div>
</template>

<script setup>
    const { $api } = useNuxtApp()
    const route = useRoute()
    const auth = useAuthStore()
    
    const selected = ref(route.params.id)

    const vehiclePool = ref([])

    const orgLink = computed({
        get() {
            if(status.value == 'success') {
                return `/orgs/${fleet.value.data.org.id}`
            }
            return ''
        }
    })

    const isAdmin = computed({
        get() {
            if (status.value == 'success' && auth.isAuthenticated && auth.user.verified && fleet.value.data.admins.find((admin) => admin.handle == auth.citizen.handle)) {
                return true
            } else {
                return false
            }
        }
    })

    const setSelected = (id) => {
        selected.value = id
    }

    const reset = () => {
        selected.value = route.params.id
        refresh()
    }

    const loadVehiclePool = async (id) => {
        const result = await $api(`/api/orgs/${id}/vehicles`, {
            key: 'getVehiclePool',
            lazy: true,
            server: false
        })
        console.log('RESULT', result)
        if (result.status == 'success') {
            vehiclePool.value = result.data
        }
    }

    const {status, data: fleet, refresh} = await useAPI(() => `/api/fleets/${route.params.id}`, {
        key: 'getFleet',
        server: false,
        lazy: true,
        async onResponse({ response }) {
            const res = response._data
            if (res.status == 'success') {
                await loadVehiclePool(res.data.org.id)
            }
        }
    })
</script>
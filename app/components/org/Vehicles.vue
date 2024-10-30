<script setup>
const props = defineProps()

const route = useRoute()

const {data, status, refresh} = useAPI(`/api/orgs/${route.params.id}/vehicles`)
</script>

<template>
    <widgets-loading v-if="status == 'pending'"/>
    <div v-else-if="status == 'success'" >
        <vehicle-collection :vehicles="data.data" view="small" :showSummary="true" />
    </div>
    
    <WidgetsNoResult v-else text="No Vehicles Found"/>
</template>
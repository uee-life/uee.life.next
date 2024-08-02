<template>
    <widgets-loading v-if="status != 'success'" />
    <div v-else class="fleet">
        <ClientOnly>
            <teleport to="#right-dock">
                <panel-dock title="Commander">
                    <citizen-portrait :citizen="fleet.cmdr" />
                </panel-dock>
            </teleport>
        </ClientOnly>
        {{ fleet }}
    </div>
</template>

<script setup>
    const route = useRoute()
    const {status, data: fleet, refresh} = await useAPI(`/api/fleets/${route.params.id}`)
</script>
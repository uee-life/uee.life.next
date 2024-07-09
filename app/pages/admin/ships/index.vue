<script setup>
const { $api } = useNuxtApp()
const result = ref(null)

const updateShips = async () => {
    result.value = await $api(`/api/admin/ships/import`)
    .catch((error) => {
        console.error(error)
    })
}

const {data: shipModels} = await useAPI('/api/ships/models', {
    key: 'getShipModels',
    server: false,
    lazy: true,
})
</script>

<template>
    <div class="main">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div class="left-left-button" @click="updateShips">
                        Update Ships
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
            <panel title="Site Data">
                Coming soon...
            </panel>
            <panel title="Action Output" titleSize="small">
                {{ result }}
            </panel>
            <ship-summary-model 
                v-if="shipModels" 
                v-for="ship in shipModels.data.models" 
                :ship="ship"/>
    </div>
</template>

<style scoped>

.main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding-top: 20px;
}
 
</style>
<script setup>
const { $api } = useNuxtApp()
const result = ref(null)

const updateRSI = async () => {
    result.value = await $api(`/api/admin/RSIData/import`)
    .catch((error) => {
        console.error(error)
    })
}
</script>

<template>
    <div class="main">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div class="left-left-button" @click="updateRSI">
                        Update RSI data
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
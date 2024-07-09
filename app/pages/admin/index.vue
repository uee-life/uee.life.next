<script setup>

</script>

<template>
    <div class="main">
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div class="left-nav-button" @click="updateRSI">
                        <nuxt-link to="/admin/ships">Ship Admin</nuxt-link>
                    </div>
                    <div class="left-nav-button" @click="updateRSI">
                        <nuxt-link to="/admin/RSIData">RSI Admin</nuxt-link>
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <panel title="Site Data">
            Coming soon...
        </panel>
        <admin-storage></admin-storage>
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
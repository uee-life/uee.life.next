<script setup>

function clearCache() {
    // todo
}
</script>

<template>
    <div>
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div class="left-nav-button" @click="clearCache">
                        Clear Cache
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <admin-cache class="cache"></admin-cache>
    </div>
</template>

<style scoped>
.cache {
    margin-top: 20px;
}
</style>
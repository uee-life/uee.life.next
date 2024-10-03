<template>
    <div id="org-info" class="org-info">
        <org-content v-if="org.manifesto" title="Manifesto" :content="org.manifesto"></org-content>
        <org-content v-if="org.charter" title="Charter" :content="org.charter"></org-content>
        <org-content v-if="org.history" title="History" :content="org.history"></org-content>
    </div>
</template>
  
<script setup>
const props = defineProps({
    org: {
        type: Object,
        required: true
    },
    isOwner: {
        type: Boolean,
        default: false
    }
})
</script>
  
<style scoped>
    .org-info {
        padding-top: 10px;
    }
</style>
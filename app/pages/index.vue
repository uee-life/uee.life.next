<script setup>
import { mainStore } from '~/stores/mainStore'
const store = mainStore()

console.log(store)

const response = await $fetch("/api/test")
console.log(response)

</script>

<template>
    <div class="content">
        <!--portal to="leftDock">    
            <site-news v-if="isMobile"/>
            <news-filter v-if="!isMobile"/>
            <official-links v-if="!isMobile" />
            <community-links v-if="!isMobile" />
            <news-filter v-if="isMobile">
        </portal>
        <portal to="rightDock">
            <giveaway />
            <official-links v-if="isMobile" />
            <community-links v-if="isMobile" />
            <site-stats :stats="stats" />
            <latest-citizen v-if="stats" :handle="stats.latestCitizen" />
        </portal-->
        <!--site-news v-if="!isMobile" style="margin-bottom: 30px"/-->
        <news-feed />
    </div>
</template>
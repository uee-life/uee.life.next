<script setup>
import { mainStore } from '~/stores/mainStore'
const store = mainStore()
</script>

<template>
    <div class="content">
        <teleport to="#leftDock">   
            <div>left dock</div> 
            <!--site-news v-if="isMobile"/>
            <news-filter v-if="!isMobile"/>
            <official-links v-if="!isMobile" />
            <community-links v-if="!isMobile" />
            <news-filter v-if="isMobile"-->
        </teleport>
        <teleport to="#rightDock">
            <div>right dock</div>
            <!--giveaway />
            <official-links v-if="isMobile" />
            <community-links v-if="isMobile" />
            <site-stats :stats="stats" />
            <latest-citizen v-if="stats" :handle="stats.latestCitizen" /-->
        </teleport>
        <!--site-news v-if="!isMobile" style="margin-bottom: 30px"/-->
        <news-feed />
    </div>
</template>
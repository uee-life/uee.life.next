<script setup>
import { mainStore } from '~/stores/mainStore'
const store = mainStore()
let isMobile = false
</script>

<template>
    <div class="content">
        <teleport to="#left-dock">
            <layout-dock-item title="News Source" type="news-filter"/>
        </teleport>
        <!--site-news v-if="!isMobile" style="margin-bottom: 30px"/-->
        <news-feed />

        <teleport to="#right-dock">
            <layout-dock-item title="Test" type="test"/>
        </teleport>
    </div>
</template>

<style>
    @font-face {
        font-family: spaceage;
        src:url("@/assets/fonts/spaceage.ttf");
    }
</style>
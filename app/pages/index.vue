<template>
    <client-only>
        <div class="content">
            <teleport to="#left-dock">
                <panel-dock title="News Source" type="news-filter"/>
            </teleport>
            <widgets-site-news v-if="!store.isMobile" style="margin-bottom: 30px"/>
            <news-feed />

            <teleport to="#right-dock">
                <panel-dock title="Test" type="test"/>
            </teleport>
        </div>
    </client-only>
</template>

<script setup>
import { mainStore } from '~/stores/mainStore'
const store = mainStore()
</script>

<style>
    @font-face {
        font-family: spaceage;
        src:url("@/assets/fonts/spaceage.ttf");
    }
</style>
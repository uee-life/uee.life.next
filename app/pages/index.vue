<template>
        <div>
            <client-only>
                <teleport to="#left-dock">
                    <widgets-site-news v-if="isMobile" style="margin: 20px 10px"/>
                    <panel-dock title="News Source" type="news-filter"/>
                    <panel-dock v-if="!isMobile" title="Official Links" type="links">
                        <widgets-links :links="officialLinks"/>
                    </panel-dock>
                    <panel-dock v-if="!isMobile" title="Community Links" type="links">
                        <widgets-links :links="communityLinks"/>
                    </panel-dock>
                </teleport>
                <teleport to="#right-dock">
                    <panel-dock v-if="isMobile" title="Official Links" type="links">
                        <widgets-links :links="officialLinks"/>
                    </panel-dock>
                    <panel-dock v-if="isMobile" title="Community Links" type="links">
                        <widgets-links :links="communityLinks"/>
                    </panel-dock>
                    <panel-dock title="Test" type="test"/>
                </teleport>
            </client-only>

            <widgets-site-news v-if="!isMobile" style="margin: 20px 0;"/>
            <news-feed />
        </div>
</template>

<script setup>
const { $viewport } = useNuxtApp()

const isMobile = computed({
    get() {
        return $viewport.isLessThan('tablet')
    }
})

const officialLinks = [
    {name: "RSI Main Site", url: "https://robertsspaceindustries.com"},
    {name: "Galactapedia", url: "https://robertsspaceindustries.com/galactapedia"},
    {name: "Starmap", url: "https://robertsspaceindustries.com/starmap"},
    {name: "Spectrum", url: "https://robertsspaceindustries.com/spectrum/community/SC"},
    {name: "Community Hub", url: "https://robertsspaceindustries.com/community"},
]

const communityLinks = [
    {name: "SC Wiki", url: "https://starcitizen.tools"},
    {name: "Erkul fitting Calculator", url: "https://erkul.games/calculator"},
    {name: "Gallog Trade Tool", url: "https://gallog.co/trading/"},
    {name: "Starship42 Ship Viewer", url: "https://www.starship42.com"},
    {name: "GameGlass", url: "https://gameglass.gg"},
    {name: "Bar Citizens", url: "https://barcitizen.sc"}
]

</script>

<style>
    @font-face {
        font-family: spaceage;
        src:url("@/assets/fonts/spaceage.ttf");
    }
</style>
<template>
    <client-only>
        <div class="content">
            <teleport to="#left-dock">
                <panel-dock title="News Source" type="news-filter"/>
                <panel-dock title="Official Links" type="links">
                    <widgets-links :links="officialLinks"/>
                </panel-dock>
                <panel-dock title="Community Links" type="links">
                    <widgets-links :links="communityLinks"/>
                </panel-dock>
            </teleport>
            <widgets-site-news style="margin-bottom: 30px"/>
            <news-feed />

            <teleport to="#right-dock">
                <panel-dock title="Test" type="test"/>
            </teleport>
        </div>
    </client-only>
</template>

<script setup>

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
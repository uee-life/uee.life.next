<template>
    <client-only>
        <div class="content">
            <teleport to="#left-dock">
                <layout-dock-item class="nav" title="nav">
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#about'}">About UEE.life</nuxt-link></div>
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#social' }">Social Links</nuxt-link></div>
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#support' }">Support Us</nuxt-link></div>
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#releases' }">Releases</nuxt-link></div>
                </layout-dock-item>
                <widgets-made-by />
            </teleport>
            <section id="about">
                <layout-panel-main class="content">
                    <h1>About UEE.life</h1>
                    <div>Stuff and things</div>
                </layout-panel-main>
            </section>
            <section id="social">
                <layout-panel-main class="content">
                    <h1>Socials</h1>
                    <div>Stuff and things</div>
                </layout-panel-main>
            </section>
            <section id="support">
                <layout-panel-main class="content">
                    <h1>How to support UEE.life</h1>
                    <div>Stuff and things</div>
                </layout-panel-main>
            </section>
            <section id="releases">
                <layout-panel-main class="content">
                    <h1>About UEE.life</h1>
                    <div>Stuff and things</div>
                </layout-panel-main>
            </section>
        </div>
    </client-only>
</template>

<script>

export default {
  layout: ({ isMobile }) => isMobile ? 'mobile' : 'default',
}
</script>

<style scoped>
    .about {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }

    .nav {
        display: flex;
        flex-direction: column;
    }
</style>
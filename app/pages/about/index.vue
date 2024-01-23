<template>
    <client-only>
        <div class="content">
            <teleport to="#left-dock">
                <panel-dock class="nav" title="nav">
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#about'}">About UEE.life</nuxt-link></div>
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#social' }">Social Links</nuxt-link></div>
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#support' }">Support Us</nuxt-link></div>
                    <div class="left-nav-button"><nuxt-link :to="{ hash: '#releases' }">Releases</nuxt-link></div>
                </panel-dock>
                <widgets-made-by />
            </teleport>
            <section id="about">
                <panel-main class="content" title="About UEE.life">
                    <panel-markdown content="about.md"/>
                </panel-main>
            </section>
            <section id="social">
                <panel-main class="content" title="Social Media">
                    <panel-markdown content="social.md"/>
                </panel-main>
            </section>
            <section id="support">
                <panel-main class="content" title="Support Us">
                    <panel-markdown content="support.md"/>
                </panel-main>
            </section>
            <section id="releases">
                <panel-main class="content" title="Releases">
                    <panel-markdown content="releases.md"/>
                </panel-main>
            </section>
        </div>
    </client-only>
</template>

<script>

/*export default {
  layout: ({ isMobile }) => isMobile ? 'mobile' : 'default',
}*/
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
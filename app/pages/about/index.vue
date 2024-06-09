<template>
        <div class="content">
            <client-only>
                <teleport to="#left-dock">
                    <panel-dock class="nav" title="nav">
                        <div class="left-nav-button"><nuxt-link :to="{ hash: '#about'}">About UEE.life</nuxt-link></div>
                        <div class="left-nav-button"><nuxt-link :to="{ hash: '#social' }">Social Links</nuxt-link></div>
                        <div class="left-nav-button"><nuxt-link :to="{ hash: '#support' }">Support Us</nuxt-link></div>
                        <div class="left-nav-button"><nuxt-link :to="{ hash: '#releases' }">Releases</nuxt-link></div>
                    </panel-dock>
                    <widgets-made-by />
                </teleport>
            </client-only>
            <section id="about">
                <panel-main class="content" title="About UEE.life">
                    <panel-markdown file="about.md"/>
                </panel-main>
            </section>
            <section id="social">
                <panel-main class="content" title="Social Media">
                    <panel-markdown file="social.md"/>
                </panel-main>
            </section>
            <section id="support">
                <panel-main class="content" title="Support Us">
                    <panel-markdown file="support.md"/>
                </panel-main>
            </section>
            <section id="releases">
                <panel-main class="content" title="Releases">
                    <panel-markdown file="releases.md"/>
                </panel-main>
            </section>
        </div>
</template>

<script setup>

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
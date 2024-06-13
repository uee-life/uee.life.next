<template>
        <div class="about">
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
                <panel class="about-content" title="About UEE.life">
                    <markdown file="about.md"/>
                </panel>
            </section>
            <section id="social">
                <panel title="Social Media">
                    <markdown file="social.md"/>
                </panel>
            </section>
            <section id="support">
                <panel title="Support Us">
                    <markdown file="support.md"/>
                </panel>
            </section>
            <section id="releases">
                <panel title="Releases">
                    <markdown file="releases.md"/>
                </panel>
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
        padding-top: 20px;
    }

    .nav {
        display: flex;
        flex-direction: column;
    }
</style>
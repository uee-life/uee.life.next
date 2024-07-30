<template>
    <div class="page-head">
        <div class="page-head-left">
            <nuxt-link to="/"><img class="logo" alt="logo" src="@/assets/logo.png"></nuxt-link>
            <div class="title">
                Connect. Manage. Explore.
            </div>
        </div>
        <div class="page-head-right">
            <transition name="fade">
                <div v-if="auth.isAuthenticated" class="user">
                    <nuxt-link :to="citizenLink">
                        <span class="name">{{ auth.citizen.name ? auth.citizen.name : auth.citizen.handle }}</span>
                        <citizen-portrait v-if="auth.isAuthenticated" size="small" shape="round" :citizen="auth.citizen" :show-status="true"/>
                    </nuxt-link>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
const auth = useAuthStore()

const citizenLink = computed({
    get() {
        return `/citizens/${auth.citizen.handle}`
    }
})
</script>

<style scoped>
    @font-face {
        font-family: spaceage;
        src:url("@/assets/fonts/spaceage.ttf");
    }

    .page-head {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 110px;
        border: 1px solid black;
        background: rgba(13, 46, 66, 0.5);
    }

    .page-head-left {
        display: flex;
    }

    .page-head-left>a {
        border: none;
    }

    .page-head-left .logo {
        width: 90px;
        height: 90px;
        margin: 10px;
        align-self: center;
    }

    .page-head-left .title {
        align-self: center;
        font-family: spaceage;
        font-size: 20px;
    }

    .page-head-right {
        display: flex;
        flex-direction: column;
        margin: 10px;
    }

    .page-head-right .user {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .page-head-right>.user>a {
        display: flex;
        align-items: center;
        color: #39ced8;
        text-decoration: none;
        cursor: pointer;
    }

    .page-head-right>.user>a:hover {
        color: #dbf3ff;
    }

    .page-head-right>.user .name {
        margin: 10px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter-to, .fade-leave {
        opacity: 1;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
<script setup>
  const auth = useAuthStore()
  const config = useRuntimeConfig();
</script>

<template>
  <div class="app">
    <div class="main" id="page-wrap">
      <layout-navbar-mobile />
      <layout-notifications />
      <layout-banner-dock name="banner-full" />
      <layout-dock name="left-dock" />
      <div class="content">
        <layout-banner-dock name="banner-content" />
        <slot />
      </div>
      <layout-dock name="right-dock" />
    </div>
    <layout-footer />
    <client-only>
        <teleport to="#notifications">
            <widgets-notification
                messageType="warning" 
                messageText="Test Version - Data May Not Persist" 
                :modality="false" 
                v-if="config.public.test_env"></widgets-notification>
            <widgets-notification 
                messageType="info" 
                messageText="Account not verified - Click for settings" 
                :modality="false" 
                v-if="auth.isAuthenticated && !auth.user.verified"
                @click="navigateTo('/settings')" 
                style="cursor: pointer" />
        </teleport>
    </client-only>
  </div>
</template>

<style scoped>

@viewport {
    max-zoom: 1;
  }

.app {
  position: relative;
  min-height: 100vh;
  max-width: 100vw;
  padding-bottom: 90px;
  font-family: larabie;
  padding-top: 55px;
}

.main {
  display: flex;
  flex-wrap: wrap;
  max-width: 1920px;
  margin: auto;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 130px)
}
.app::before {
  position: fixed;
  content: "";
  background: url("@/assets/starfield.jpg") repeat center;
  opacity: 0.6;
  top:0;
  left:0;
  bottom: 0;
  right: 0;
  z-index: -2;
}
.app::after {
  position: fixed;
  content: "";
  background: url("@/assets/gridbg_glow.png") repeat center top;
  opacity: 0.5;
  top:0;
  left:0;
  bottom: 0;
  right: 0;
  z-index: -1;
}

.content {
  margin: 0 5px 0 10px;
  flex-grow: 1;
  flex-basis: 300px;
}
</style>

<template>
  <div class="app">
    <layout-header-default />
    <layout-notifications />
    <layout-navbar-default />

    <div class="main">
      <layout-dock name="left-dock" />
      <div class="content">
        <slot></slot>
      </div>
      <!-- the margin-right is to account for the scrollbar gutter -->
      <layout-dock name="right-dock" style="margin-right: -5px"/>
      <layout-footer />
    </div>
    
    <client-only>
        <teleport to="#notifications">
            <widgets-notification
                messageType="warning" 
                messageText="Test Version - Data May Not Persist" 
                :modality="false" 
                v-if="config.public.test_env"></widgets-notification>
            <widgets-notification 
                messageType="info" 
                messageText="Account not verified - Click to open settings" 
                :modality="false" 
                v-if="auth.isAuthenticated && !auth.citizen.verified"
                @click="navigateTo('/settings')" 
                style="cursor: pointer" />
        </teleport>
    </client-only>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const config = useRuntimeConfig();
</script>

<style scoped>

.app {
  position: relative;
  min-height: 100vh;
  max-width: 100vw;
  padding-bottom: 90px;
  font-family: larabie;
  max-width: 1920px;
  margin: auto;
}

.main {
  display: flex;
  flex-wrap: wrap;
  max-width: 1920px;
  margin: auto;
  overflow-y: auto;
  overflow-x: visible;
  height: calc(100vh - 148px);
  /* set the gutter to stable so the layout doesn't get messed up turning on scrollbar */
  scrollbar-gutter: stable;
}

.app::before {
  position: fixed;
  content: "";
  background: url("@/assets/starfield.jpg") repeat center;
  opacity: 0.6;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -2;
}

.app::after {
  position: fixed;
  content: "";
  background: url("@/assets/gridbg_glow.png") repeat center top;
  opacity: 0.5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
}

.content {
  margin: 0 10px;
  flex-grow: 1;
  flex-basis: 300px;
}
</style>
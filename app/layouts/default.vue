<template>
  <div class="app">
    <layout-header-default />
    <panel class="warning-panel" v-if="config.public.test_env">
      Test Version. Content May Not Persist.
    </panel>
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
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const auth = useAuthStore()
</script>

<style scoped>

.warning-panel {
  display: flex;
  margin: 10px;
  background: rgba(255,0,0,0.1);
  color: #dbf3ff;
  justify-content: center;
  min-height: 30px;
}

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
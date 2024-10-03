<template>
  <div class="app">
    <div class="main" id="page-wrap">
      <layout-navbar-mobile />
      <layout-dock name="left-dock" />
      <div class="content">
        <slot />
      </div>
      <layout-dock name="right-dock" />
    </div>
    <layout-footer />
  </div>
</template>

<style scoped>
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
  margin: 0 10px;
  flex-grow: 1;
  flex-basis: 300px;
}
</style>

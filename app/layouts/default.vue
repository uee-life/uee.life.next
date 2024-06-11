<template>
  <div class="app">
    <layout-header-default />
    <layout-navbar-default />
    <div class="main">
      <layout-dock name="left-dock" />
      <div class="content">
        <slot></slot>
      </div>
      <layout-dock name="right-dock" />
      <layout-footer-default />
    </div>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  max-width: 100vw;
  /*padding-bottom: 175px;*/
  font-family: larabie;
}

/*.main::-webkit-scrollbar {
  background: rgba(84, 111, 132, 0.5);
}

.main::-webkit-scrollbar-thumb {
  background: rgba(13, 46, 66, 0.8);
}*/

.main {
  display: flex;
  flex-wrap: wrap;
  max-width: 1920px;
  margin: auto;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 148px)
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

.dock {
  max-width: 260px;
  margin: 0 auto;
}

/*.leftDock {
   min-width: 240px;
 }*/
.vue-portal-target {
  display: flex;
  flex-direction: column;
  justify-content: center;
}</style>
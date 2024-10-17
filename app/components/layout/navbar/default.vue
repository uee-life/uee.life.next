<script setup>
const auth = useAuthStore()

const modals = ref({
  signup: false
})

const handleSuccess = (message) => {
  modals.value.signup = false
  console.log('SUCCESS', message)
}

const handleError = (message) => {
  modals.value.signup = false
  console.log('ERROR', message)
}
</script>

<template>
  <div class="nav-bar" id="nav-bar">
      <div class="nav-left">
        <nuxt-link class="nav-button" to="/" exact>Home</nuxt-link>
        <nuxt-link class="nav-button" to="/about">About</nuxt-link>
        <nuxt-link class="nav-button" to="/citizens">Citizens</nuxt-link>
        <nuxt-link class="nav-button" to="/orgs">Organizations</nuxt-link>
        <nuxt-link class="nav-button" to="/explore">Explore</nuxt-link>
      </div>
      <div class="nav-right">
        <template v-if="auth.isAuthenticated">
          <nuxt-link v-if="['capn_flint', 'capn_nemo'].includes(auth.citizen.handle.toLowerCase())" class="nav-button" to="/admin">Admin</nuxt-link>
          <nuxt-link class="nav-button" to="/assignments">Assignments</nuxt-link>
          <nuxt-link class="nav-button" to="/settings">Settings</nuxt-link>
          <a class="nav-button" @click="useLogout()">Sign Off</a>
        </template>
        <template v-else>
          <a class="nav-button" href="/auth/login">Log In</a>
          <a class="nav-button" @click="modals.signup = true">Register</a>
        </template>
      </div>
      <modal-sign-up v-if="modals.signup" @close="modals.signup = false" @done="modals.signup = false"/>
  </div>
</template>

<style scoped>
    .nav-bar {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
        border: 1px solid #546f84;
        margin: 10px 10px 0;
        padding: 5px;
        background: url('@/assets/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        position: relative;
    }

    .nav-left {
        display: flex;
        align-self: center;
    }

    .nav-right {
      display: flex;
      align-self: center;
    }

    .nav-button {
        font-family: 'Michroma';
        font-size: 11px;
        margin-left: 10px;
        margin-right: 10px;
        cursor: pointer;
    }
    .nav-button a {
      text-decoration: none;
      color: #39ced8;
    }
    .nav-button a:hover {
      color: #dbf3ff;
    }

    .header {
        display: flex;
        margin-bottom: 20px;
    }
    a {
        margin-right: 20px;
        font-size: 14px;
        color: #39ced8;
        text-decoration: none;
        text-transform: uppercase;
        border-bottom: none;
        transition: color .25s;
        font-weight: 400;
        line-height: normal;
    }
    a:hover {
        color: #dbf3ff;
    }
    a.router-link-active {
        color: #dbf3ff;
        border: none;
        font-weight: 600;
    }
</style>
<template>
    <div class="loading">
      <client-only>
        <widgets-loading />
      </client-only>
    </div>
</template>

<script setup>

const {$swal} = useNuxtApp()
const route = useRoute()

onMounted(async () => {
  nextTick(async () => {
    if (route.query.error) {
        $swal.fire({
            title: route.query.error,
            text: route.query.error_description,
            icon: 'error',
            confirmButtonText: 'OK!'
        }).then((result) => {
            if(result.isConfirmed) {
                useLogout()
            }
        })
    } else {
        await useFetch('/auth/callback', {
            key: 'authCallback',
            query: route.query,
            async onResponse(_ctx) {
                const result = _ctx.response._data
                console.log("onResponse: ", result)
                if(result.status == "success") {
                    $swal.fire({
                        title: 'Success!',
                        text: "You are now logged in!",
                        icon: 'success'
                    })
                    navigateTo('/')
                } else {
                    // there's an error
                    navigateTo('/')
                }
            }
        })
    }
  })
})

/*const config = require('~/config.json')

export default {
  layout: ({ isMobile }) => isMobile ? 'mobile' : 'default',
  methods: {
    sanitize(s) {
      var chars = {'<':'&lt;','>':'&gt;','"':'&quot;', '&':'&amp;', "'": '&#x27;', '/': '&#x2f;'};
      s = s.replace(/[<>"'\/]/g, m => chars[m]);
      return s
    },
    getQueryParams() {
      const params = {}
      this.$nuxt.$route.fullPath.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
        params[$1] = $3
      })
      return params
    },
    getErrors() {
      if (process.server) return
      let err, err_msg = ''
      const params = this.getQueryParams()
      if ('error' in params) {
        err = params['error'],
        err_msg = this.sanitize(decodeURIComponent(params['error_description']))
        this.$swal.fire({
          title: err, 
          text: err_msg, 
          icon: 'warning',
          onAfterClose: () => {
            window.location = `https://ueelife.auth0.com/v2/logout?returnTo=https%3A%2F%2Fuee.life&client_id=${config.AUTH0_CLIENT_ID}`
          }
        })
        this.$router.replace('/')
      }
    }
  },
  mounted() {
    // Check for errors encountered via the auth flow, display then clear their auth0 session
    this.getErrors()
  }
}*/
</script>

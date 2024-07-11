<template>
    <div class="loading">
      <client-only>
        <widgets-loading />
      </client-only>
    </div>
</template>

<script setup>
const {$swal, $api} = useNuxtApp()
const route = useRoute()

const auth = useAuthStore()

const returnPath = useCookie('auth0_return_path')

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
        const { status } = await $api('/auth/callback', {
            key: 'authCallback',
            query: route.query
        })

        if (status == 'success') {
            auth.loadUser()
            navigateTo(returnPath.value)
        } else { 
            $swal.fire({
                title: "Error",
                text: result,
                icon: 'error',
                confirmButtonText: 'OK!'
            }).then((result) => {
                if(result.isConfirmed) {
                    navigateTo('/')
                }
            })
        }
    }
  })
})
</script>

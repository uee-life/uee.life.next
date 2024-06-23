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

const returnPath = useCookie('auth0_return_path')

console.log('found return cookie: ', returnPath)

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
        await $fetch('/auth/callback', {
            key: 'authCallback',
            query: route.query,
            async onResponse(_ctx) {
                const result = _ctx.response._data
                console.log("onResponse: ", result)
                if(result.status == "success") {
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
    }
  })
})
</script>

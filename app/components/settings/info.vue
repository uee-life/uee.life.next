<template>
    <panel class="profile-info" id="profile-info" title="User Profile" title-size="medium">
        <div v-if="account" class="info">
            <h3>Account</h3>
            <div class="line-item">
                <div class="label">Username: </div> 
                <div> {{account.username}}</div>
            </div>
            <div class="line-item pointer">
                <div class="label">Email:</div> 
                <span v-if="showEmail" @click="showEmail = !showEmail">{{account.email}} <img class="verified" src="@/assets/tick.png" v-if="account.email_verified" /></span>
                <span v-else @click="showEmail = !showEmail">[click to show] <img class="verified" src="@/assets/tick.png" v-if="account.email_verified" /></span>
                &nbsp;<span></span>
            </div>
            <div class="line-item"><div class="label">Created: </div> <div> {{new Date(account.created_at).toDateString()}} @ {{new Date(account.created_at).toLocaleTimeString()}}</div></div>
            <div class="line-item"><div class="label">Last Login: </div> <div> {{new Date(account.last_login).toDateString()}} @ {{new Date(account.last_login).toLocaleTimeString()}}</div></div>
            <div class="line-item  pointer">
                <div class="label">Login IP: </div> 
                <span v-if="showIP" @click="showIP = !showIP"> {{ account.last_ip }} </span>
                <span v-else @click="showIP = !showIP">[click to show]</span>
            </div>
              <br />
              <h3>RSI Connection</h3>
            <div class="line-item">
                <div class="label">RSI Handle: </div> 
                <span> {{account.app_metadata.handle}}
                    <img class="verified" src="@/assets/tick.png" v-if="account.app_metadata.handle_verified" />
                    <img class="verified" src="@/assets/delete.png" v-else />
                </span>
            </div>
            <div class="line-item"><div class="label">Change Handle: </div> <div><input type="text" v-model="handle"> <input type="button" value="change" @click="ifSure(changeHandle)" /></div></div>
            <em style="color: red; opacity:0.8">Warning: Changing handle revokes verification status, and deletes all vehicles and discoveries! Proceed with caution!</em>
        </div>
    </panel>
</template>

<script setup>
const {$swal, $api} = useNuxtApp()
const emit = defineEmits(['refresh'])

const props = defineProps({
    account: {
        type: Object,
        required: true
    }
})

const showEmail = ref(false)
const showIP = ref(false)
const handle = ref(props.account.app_metadata.handle)

const ifSure = async (cb) => {

    if (handle.value == props.account.app_metadata.handle) {
        return
    } else if (await handleClaimed() && handle.value != props.account.app_metadata.handle) {
        $swal.fire({
            title: 'Handle Unavailable',
            text: 'This handle has already been claimed and verified!',
            icon: 'error',
            confirmButtonText: 'OK!'
        })
    } else {
        $swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                cb()        
            }
        })
    }
}

const changeHandle = async () => {
    const result = await $api(`/api/user/handle`, {
        method: 'POST',
        body: {
            handle: handle.value
        }
    })
    console.log(result)
    reloadNuxtApp()
}

const handleClaimed = async () => {
    const citizen = await $api(`/api/citizens/${handle.value}`)
    if (citizen.data.verified) {
        return true
    }
    return false
}

</script>

<style scoped>
    .profile-info {
        position: relative;
        display: flex;
        height: fit-content;
        padding: 10px;
        margin-top: 10px;
        margin-bottom: 20px;
        width: 100%;
        opacity: 0;
    }

    .profile-info .portrait{
        width: 50px;
        height: 50px;
        padding: 7px;
        margin-right: 20px;
        background: url('/images/fading-bars.png') repeat;
        position: relative;
        opacity: 0;
    }

    .profile-info .portrait img {
        width: 136px;
        height: 136px;
        opacity: 0;
    }
    .profile-info .info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: space-between;
        opacity: 1;
    }
    .line-item {
        display: flex;
        margin-left: 15px;
    }
    
    .line-item.pointer span {
        cursor: pointer;
    }
    .line-item .label {
        width: 150px;
        font-family: Michroma;
        font-size: 13px;
        color: #dbf3ff;
    }

    .verified {
        width: 13px;
    }
</style>
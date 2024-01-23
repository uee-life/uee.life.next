<template>
    <div class="page-head">
        <div class="page-head-left">
            <nuxt-link to="/"><img class="logo" alt="logo" src="@/assets/logo.png"></nuxt-link>
            <div class="title">
                Explore. Manage. Connect.
            </div>
        </div>
        <div class="page-head-right">
            <div class="user">
                <div class="welcome">
                    Welcome, Citizen!
                </div>
            </div>
            <div class="search">
                <!--input type="search" class="search-box" value="Search"-->
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '~/stores/auth';

const store = useAuthStore()

const user = computed({
    get() {
        return store.user
    }
})

const citizenLink = computed({
    get() {
        if(user) {
            return `/citizens/${user}`
        } else {
            return `/citizens`
        }
    }
})
/*import { mapGetters } from 'vuex'

export default {
    name: 'main-header',
    computed: {
        user() {
            return this.$auth.user
        },
        citizenLink() {
            if(this.user) {
                return `/citizens/${this.user['https://uee.life/app_metadata'].handle}`
            } else {
                return `/citizens`
            }
        }
    }
}*/
</script>

<style scoped>
    @font-face {
        font-family: spaceage;
        src:url("@/assets/fonts/spaceage.ttf");
    }

    .page-head {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 110px;
        border: 1px solid black;
        background: rgba(13, 46, 66, 0.5);
    }

    .page-head-left {
        display: flex;
    }

    .page-head-left>a {
        border: none;
    }

    .page-head-left .logo {
        width: 90px;
        height: 90px;
        margin: 10px;
        align-self: center;
    }

    .page-head-left .title {
        align-self: center;
        font-family: spaceage;
        font-size: 20px;
    }

    .page-head-right {
        display: flex;
        flex-direction: column;
        margin: 15px;
    }

    .page-head-right .user {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .page-head-right .user a {
        cursor: pointer;
    }

    .page-head-right .user .welcome>a {
        color: #39ced8;
        text-decoration: none;
    }

    .page-head-right .user .welcome>a:hover {
        color: #dbf3ff;
    }

    .page-head-right .search {
        margin-top: 35px;
    }

    .page-head-right .search .search-box {
        background: white;
        height: 25px;
    }
</style>
<script setup>
const { $api } = useNuxtApp()
const route = useRoute()
const auth = useAuthStore()

const isAdmin = computed({
    get() {
        if (status.value == 'success') {
            return auth.isAuthenticated && auth.user.verified == 1 && response.value.data.admins.some(e => e.handle.toLowerCase() == auth.citizen.handle.toLowerCase())
        } else {
            return false
        }
    }
})

const ownerLink = computed({
    get() {
        if (status.value == 'success') {
            return `/fleets/${response.value.data.owner.id}`
        } else {
            return ''
        }
    }
})

const assignmentImage = computed({
    get() {
        if (status.value == 'success') {
            if (response.value.data.owner.type == 'Organization') {
                return `/images/default/${response.value.data.class}.jpg`
            } else {
                return `/images/ships/${response.value.data.target.identifier}.jpg`
            }
            
        } else {
            return `/images/default/Vehicle.jpg`
        }
    }
})

const assignmentLogo = computed({
    get() {
        switch (response.value.data.owner.type) {
            case 'Organization':
                return response.value.data.owner.logo
            case 'Citizen':
                return response.value.data.owner.portrait
            default:
                return ''
        }
    }
})

const assignmentTag = computed({
    get() {
        switch (response.value.data.owner.type) {
            case 'Organization':
                return response.value.data.fleet.name
            case 'Citizen':
                return response.value.data.target.name ? response.value.data.target.name : response.value.data.target.id
            default:
                return response.value.data.class
        }
    }
})

const assignmentName = computed({
    get() {
        if (response.value.data.owner.type == 'Citizen' && response.value.data.class == 'Vehicle') {
            return `${response.value.data.target.manufacturer} ${response.value.data.target.model}`
        } else {
            return response.value.data.owner.name
        }
    }
})

const assignMember = async (data) => {
    console.log('addAssigned', data)
    // add an API call to add assignee 
}

const { data: response, refresh, status } = useAPI(`/api/assignments/${route.params.id}`)
</script>

<template>
    <widgets-loading v-if="status == 'pending'" />
    <div v-else-if="status == 'success' && response.status == 'success'">
        <layout-banner 
                display="full"
                :name="assignmentName"
                :tag="assignmentTag"
                :type="`${response.data.class} ${response.data.type}`"
                :image="assignmentImage"
                :logo="assignmentLogo" 
                @clicked="navigateTo(ownerLink)">
                <template v-slot:logoslot>
                    <citizen-portrait :citizen="response.data.owner" size="medium" shape="round"></citizen-portrait>
                </template>
        </layout-banner>
        <template v-if="response.data.class == 'Vehicle'">
            <layout-banner v-if="response.data.owner.type == 'Organization'"
                display="content"
                :name="response.data.target.model"
                :tag="response.data.target.name"
                :type="response.data.target.career + ' / ' + response.data.target.role"
                :image="`/images/ships/${response.data.target.identifier}.jpg`"
                :logo="`/images/manufacturers/${response.data.target.manufacturer}.png`"
                @clicked="navigateTo(ownerLink)" />
            <vehicle v-if="response.data.target.id"
                :vehicle-id="response.data.target.id"
                :show-owner="response.data.owner.type == 'Organization'"
                @refresh="refresh" />
            <assignment 
                :assignment="response.data"
                :max-assignees="response.data.max_assigned"
                :owner="isAdmin"
                @refresh="refresh"></assignment>
        </template>
    </div>
    <widgets-no-result v-else text="Assignment not found" />
</template>

<style scoped>

</style>
<script setup>
const { $api } = useNuxtApp()
const route = useRoute()

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
        if (status == 'success') {
            return `/images/default/${response.value.data.type}.jpg`
        } else {
            return `/images/default/Vehicle.jpg`
        }
    }
})

const assignmentLogo = computed({
    get() {
        switch (response.value.data.type) {
            case 'Organization':
                return response.value.data.owner.logo
            case 'Citizen':
                return response.value.data.owner.portrait
            default:
                return ''
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
        <client-only>
            <teleport to="#left-dock">
                <panel-dock v-if="response.data.owner.handle" title="Assignment Owner" class="owner">
                    <citizen-portrait :citizen="response.data.owner" :showName="true" />
                </panel-dock>
                <citizen-org v-else title="Assignment Owner" :org="response.data.owner" :showName="true" />
            </teleport>
        </client-only>
        <layout-banner 
                display="full"
                :name="response.data.owner.name"
                :tag="response.data.target.name ? response.data.target.name : response.data.target.id"
                :type="`${response.data.type} ${response.data.name}`"
                :image="assignmentImage"
                :logo="assignmentLogo" 
                @clicked="navigateTo(ownerLink)"/>
        <template v-if="response.data.type == 'Vehicle'">
            <vehicle v-if="response.data.target.id"
                :vehicle-id="response.data.target.id"
                :show-crew="false"
                @refresh="refresh" />
            <assignment 
                :assignment="response.data"
                :max-assignees="response.max_assigned"></assignment>
        </template>
        {{ response.data }}
    </div>
    <widgets-no-result v-else text="Assignment not found" />
</template>

<style scoped>

</style>
<script setup>
const { $api } = useNuxtApp()

const emit = defineEmits(['add', 'remove', 'refresh'])
const props = defineProps({
    assignment: {
        type: Object,
        required: true
    },
    maxAssignees: {
        type: Number,
        default: 0
    },
    owner: {
        type: Boolean,
        default: false
    },
    defaultRole: {
        type: String,
        default: ''
    },
    showSummary: {
        type: Boolean,
        default: true
    }
})

const add = async (data) => {
    // check there's room for another assignee
    if (props.assignment.assignees.filter(e => e != null).length >= props.maxAssignees) {
        // too many
    } else {
        await $api(`/api/assignments/${props.assignment.id}/assign`, {
            method: 'POST',
            body: {
                handle: data.handle,
                target: props.assignment.id,
                role: data.role
            }
        })
    }
    emit('refresh')
}

const remove = async (data) => {
    await $api(`/api/assignments/${props.assignment.id}/remove`, {
        method: 'POST',
        body: {
            handle: data.handle
        }
    })
    emit('refresh')
}
</script>

<template>
    <assignment-summary v-if="assignment.class == 'VehicleGroup'" :assignment="assignment" :is-admin="owner" @add="add" @remove="remove"/>
    <panel-section v-else-if="assignment.class == 'Vehicle'" class="assignees" :title="`${assignment.type} Assignees`" title-size="small">
        <assignment-member-list
        :assignees="assignment.assignees"
        :max-assigned="assignment.target.max_crew"
        :can-edit="owner"
        @add="add"
        @remove="remove" />
    </panel-section>
    
</template>

<style scoped>

</style>
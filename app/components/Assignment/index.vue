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
    console.log('assigning citizen:', data)
    // check there's room for another assignee
    if (props.assignment.assignees.filter(e => e != null).length >= props.maxAssignees) {
        console.log(props.assignment.assignees)
        console.log('too many')
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
    console.log('removing crew:', data)
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
    <assignment-summary :assignment="assignment" />
</template>

<style scoped>

</style>
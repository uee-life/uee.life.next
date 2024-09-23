<script setup>
const props = defineProps({
    assignment: {
        type: Object,
        required: true
    }
})

const auth = useAuthStore()
</script>

<template>
    <panel :title="`Assignment ${assignment.id}`" title-size="small">
        <div class="assignment-summary">
            <div class="owner">
                <panel-dock v-if="assignment.owner.type == 'Citizen'" title="Owner">
                    <citizen-portrait :citizen="assignment.owner" :show-name="true">
                        Assignment Owner
                    </citizen-portrait>
                </panel-dock>
                <citizen-org v-if="assignment.owner.type == 'Organization'" :org="assignment.owner"></citizen-org>
            </div>
            <div class="info">
                <div>Assignment Type: {{ `${assignment.class} ${assignment.type}` }}</div>
                <div>Assignment Role: {{ assignment.assignees.find(e => e.handle == auth.handle).role }}</div>
                <template v-if="assignment.class == 'Vehicle'">
                    <div>Assigned Vehicle: {{ assignment.target.name ? assignment.target.name : vehicleID(assignment.target.id) }}</div>
                </template>
            </div>
        </div>
    </panel>
</template>

<style scoped>
.assignment-summary {
    display: flex;
}

</style>
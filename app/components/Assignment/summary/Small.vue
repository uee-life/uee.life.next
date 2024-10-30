<script setup>
const props = defineProps({
    assignment: {
        type: Object,
        required: true
    }
})

const auth = useAuthStore()

const removeCitizen = (data) => {
    switch(props.assignment.type) {
        case 'Crew':
            console.log('trying to remove crew: ', data.handle)
            break;
        case 'Leader':
            console.log('trying to remove Commander: ', data.handle)
    }
}
</script>

<template>
    <panel :title="`${assignment.type} Assignment #${assignment.id}`" title-size="small">
        <div class="assignment-summary">
            <div class="owner">
                <panel-section title-size="small" title="Owner">
                    <div class="owner">
                        <citizen-portrait v-if="assignment.owner.type == 'Citizen'"
                            :citizen="assignment.owner" 
                            size="small" 
                            :show-name="true">
                        </citizen-portrait>
                        <citizen-org v-else-if="assignment.owner.type == 'Organization'" 
                            :org="assignment.owner"
                            size="small"></citizen-org>
                    </div>     
                </panel-section>
                <panel-section v-if="assignment.fleet" title="Group" title-size="small">
                    <div class="fleet" @click="navigateTo(`/fleets/${assignment.fleet.id}`)">
                        <img src="@/assets/fleet.png" />
                        {{ assignment.fleet.name }}
                    </div>
                    
                </panel-section>
            </div>
            <div class="info">
                <template v-if="assignment.class == 'Vehicle'">
                    <vehicle-summary :vehicle="assignment.target" :assignment="assignment.id"></vehicle-summary>
                    <panel-section class="assignees" title="Assignees" title-size="small">
                        <assignment-member-list-small 
                            :assignees="assignment.assignees"
                            :max-assigned="assignment.target.max_crew"
                            @remove="removeCitizen"/>
                    </panel-section>
                </template>
                <template v-if="assignment.class == 'VehicleGroup'">

                    <panel-section class="summary" title="Fleet Assignment" title-size="small" @click="navigateTo(`/assignments/${assignment.id}`)">
                        <div><span class="label">Role:</span> <span class="value">{{ assignment.assignees.find(e => e.handle == auth.handle).role }}</span></div>
                        <div><span class="label">Fleet Group ID:</span> <span class="value upper">#{{ assignment.target.id }}</span></div>
                        <div><span class="label">Fleet Group Name:</span> <span class="value">{{ assignment.target.name }}</span></div>
                    </panel-section>
                    
                    <panel-section class="assignees" title="Assignees" title-size="small">
                        <assignment-member-list-small 
                            :assignees="assignment.assignees"
                            :max-assigned="assignment.target.max_crew"
                            @remove="removeCitizen"/>
                    </panel-section>
                </template>
            </div>
        </div>
    </panel>
</template>

<style scoped>
.assignment-summary {
    display: flex;
    flex-wrap: wrap;
}

.owner {
    min-width: 125px;
    padding: 5px;
}

.fleet {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 13px 0 5px;
    color: #dbf3ff;
    cursor: pointer;
}

.fleet img {
    width: fit-content;
}

.summary {
    min-width: 400px;
    cursor: pointer;
}

.info {
    display: flex;
    flex-direction: column;
    margin: 6px;
}

.value {
    color: #dbf3ff;
}

.value.upper {
    text-transform: uppercase;
}

</style>
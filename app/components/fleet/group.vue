<script setup>
const { $api } = useNuxtApp()

const emit = defineEmits(['refresh', 'reset', 'return'])

const props = defineProps({
    fleet: {
        type: Object,
        required: true
    },
    selected: {
        type: String,
        required: true
    },
    vehiclePool: {
        type: Array,
        default: () => {
            return []
        }
    }
})

// hacky way to get around props not actually being read-only for objects
const group = ref(JSON.parse(JSON.stringify(props.fleet)))

const groupStatus = ref('success')

const auth = useAuthStore()
const isCmdr = computed({
    get() {
        return auth.isAuthenticated
            && auth.user.verified == 1
            && auth.citizen.handle == group.value.cmdr.handle
    }
})

const isAdmin = computed({
    get() {
        if (auth.isAuthenticated) {
            if(isCmdr.value) {
                // can't be full admin of your own command group
                // To prevent people deleting the group as delegate commander
                return false
            } else if(group.value.admins.some(e => e.handle == auth.citizen.handle)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
        
    }
})

const route = useRoute()

const modals = ref({
    group: false,
    commander: false,
    vehicle: false,
    edit: false,
    confirm: false,
    confirmCmdr: false
})

const canEdit = computed({
    get() {
        return isAdmin.value || isCmdr.value
    }
})

const addGroup = async (group) => {
    modals.value.group = false
    console.log('adding group: ')
    console.log(group)
    const result = await $api(`/api/fleets/${props.selected}/add`, {
        method: 'POST',
        body: group
    })
    emit('refresh')
}

const removeGroup = async () => {
    modals.value.confirm = false
    console.log(`removing group: ${props.selected}`)
    await $api(`/api/fleets/${props.selected}/remove`, {
        method: 'POST'
    })
    if (route.params.id == props.selected) {
        emit('return')
    } else {
        emit('reset')
    }
}

const updateGroup = async (group) => {
    const result = await $api(`/api/fleets/${props.selected}/update`, {
        method: 'POST',
        body: group
    })
    emit('refresh')
    return result
}

const addCmdr = async (cmdr) => {
    modals.value.commander = false
    const grp = group.value.info
    grp.cmdr = cmdr
    const result = await updateGroup(grp)
    emit('refresh')
    // do something with the updated group?
}

const removeCmdr = async () => {
    modals.value.confirmCmdr = false
    const grp = group.value.info
    grp.cmdr = ''
    const result = await updateGroup(grp)
    emit('refresh')
}

const addVehicle = async (id) => {
    modals.value.vehicle = false

    const res = await $api(`/api/fleets/${props.selected}/vehicles/add`, {
        key: 'fleetAddVehicle',
        method: 'POST',
        body: {
            vehicleID: id,
            groupID: props.selected
        }
    })

    refresh()
}

const removeVehicle = async (vehicle) => {
    console.log('removing vehicle:', vehicle.id, 'from:', props.selected)
    await $api(`/api/fleets/${props.selected}/vehicles/remove`, {
        key: 'fleetRemoveVehicle',
        method: 'POST',
        body: {
            vehicleID: vehicle.id,
            groupID: props.selected
        }
    })
    refresh()
}

const setGroup = async () => {
    groupStatus.value = 'pending'
    const res = await $api(`/api/fleets/${props.selected}`, {
        key: 'getFleetGroup',
        onRequest() {
            console.log('getFleetGroup called')
        }
    })

    if (res.status == 'success') {
        console.log('got new group data', status)
        group.value = res.data
        groupStatus.value = 'success'
    } else {
        groupStatus.value = 'error'
    }
}

// Repurpose to get assignments for the group.

const {status, data: vehicles, refresh} = await useAPI(() => `/api/fleets/${props.selected}/vehicles`, {
    key: 'getFleetGroupVehicles'
})

watch(
    () => props.selected,
    () => {
        console.log('prop value changed', props.selected)
        setGroup()
    }
)

</script>

<template>
    <WidgetsLoading v-if="status == 'pending' || groupStatus == 'pending'"/>
    <div v-else-if="status == 'success'" class="fleet-group">
        <div class="info">
            <div class="info-panel no-grow">
                <panel :title="group.info.name" title-size="small" class="commander">
                    <div v-if="group.cmdr" class="assigned">
                        <h5>Group Commander</h5>
                        <citizen-portrait :citizen="group.cmdr" :show-name="true">
                            <div class="mask"></div>
                            <img v-if="canEdit" @click="modals.confirmCmdr = true" class="edit" src="@/assets/delete.png">
                        </citizen-portrait>
                    </div>
                    <div v-else class="unassigned">
                        <h5>Group Commander</h5>
                        <div class="bg">
                            <img v-if="canEdit" @click="modals.commander = true" src="@/assets/plus.png" class="add-new"/>
                            <div v-else class="add-new" />
                        </div>
                        <div class="name">Unassigned</div>
                    </div>
                </panel>
                <slot name="assignment"></slot>
            </div>
            <div class="info-panel">
                <panel v-if="canEdit" title="Tools" title-size="small" class="tools">
                    <input v-if="isAdmin" class="tool-button" @click="modals.confirm = true" type="button" value="Delete Group">
                    <input v-if="isAdmin" class="tool-button" @click="modals.edit = true" type="button" value="Edit Group">
                    <input class="tool-button" @click="modals.group = true" type="button" value="Add Subgroup">
                    <input class="tool-button" @click="modals.vehicle = true" type="button" value="Add Vehicle">
                </panel>
                <vehicle-collection 
                    :vehicles="vehicles.data" 
                    :is-owner="canEdit"
                    @add="addVehicle"
                    @remove="removeVehicle">
                    <panel-button v-if="canEdit" 
                        text="Add Vehicle" 
                        @click="modals.vehicle = true" />
                </vehicle-collection>
            </div>
        </div>
        <layout-modal v-if="modals.group" title="Add Subgroup" @close="modals.group = false">
            <forms-fleet @submit="addGroup" />
        </layout-modal>
        <layout-modal v-if="modals.edit" title="Edit Subgroup" @close="modals.edit = false">
            <forms-fleet :group="group.info" @submit="updateGroup" />
        </layout-modal>
        <modal-confirm v-if="modals.confirm" @confirm="removeGroup" @cancel="modals.confirm = false"></modal-confirm>
        <modal-confirm v-if="modals.confirmCmdr" @confirm="removeCmdr" @cancel="modals.confirmCmdr = false"></modal-confirm>
        <!--layout-modal v-if="modals.confirm" title="Are you sure?" @close="modals.confirm = false" :show-close="false">
            <div class="confirm">
                <img class="button" src="@/assets/tick.png" @click="removeGroup">
                <img class="button" src="@/assets/delete.png"  @click="modals.confirm = false">
            </div>
        </layout-modal-->
        <layout-modal v-if="modals.commander" title="Add Commander" @close="modals.commander = false">
            <forms-commander @submit="addCmdr" />
        </layout-modal>
        <layout-modal v-if="modals.vehicle" title="Add Vehicle" @close="modals.vehicle = false">
            <forms-fleet-vehicle 
                :vehicle-pool="vehiclePool" 
                @add="addVehicle"/>
        </layout-modal>
    </div>
    <WidgetsNoResult v-else="status == 'error'" text="Group not found"/>
</template>

<style scoped>
.info {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-right: -10px;
    opacity: 1;
}

.fleet-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
}

.confirm {
    display: flex;
    width: 200px;
    align-items: center;
    justify-content: center;
}

.confirm>.button {
    margin: 10px;
    width: 50px;
    cursor: pointer;
}

.vehicle-modal {
    padding: 15px;
    max-height: 75vh;
    overflow-y: scroll;
}

.info .info-panel {
    display: flex;
    flex-direction: column;
    flex-basis: 250px;
    margin: 0 10px;
    flex-grow: 1;
}

.info .info-panel .group-title {
    position: relative;

}

.info .commander {
    height: fit-content;
    max-height: fit-content;
    margin: 10px;
}

.info .tools {
    display: flex;
    justify-content: center;
    flex-grow: 0;
    flex-wrap: wrap;
}

.info .tools .tool-button {
    margin: 5px;
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
    flex-basis: 120px;
    cursor: pointer;
}

.fleet-list {
    width: 100%;
}

.info-panel.no-grow {
  flex-grow: 0 !important;
  margin: 0 auto !important;
}

.info-panel.group-info {
    display: flex;
    flex-direction: column;
}


.portrait .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.assigned {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
}

.assigned h3 {
    margin-bottom: 10px;
}

.assigned .edit {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.unassigned {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
}

.unassigned .add-new {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 165px;
    height: 165px;
    padding: 20px;
    border: 1px dashed #546f84;
    cursor: pointer;
}

.unassigned .bg {
    position: relative;
    content: "";
    background: url('https://robertsspaceindustries.com/rsi/static/images/account/avatar_default_big.jpg');
    background-size: 165px 165px;
    background-repeat: no-repeat;
    opacity: 0.4;
    width: 165px;
    height: 165px;
}

.unassigned .name {
    font-size: 16px;
}
</style>
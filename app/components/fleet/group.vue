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
    shipPool: {
        type: Array,
        default: () => {
            return []
        }
    }
})

// hacky way to get around props not actually being read-only for objects
const group = ref(JSON.parse(JSON.stringify(props.fleet)))

const auth = useAuthStore()
const isCmdr = computed({
    get() {
        return auth.isAuthenticated
            && auth.user.verified == 1
            && auth.citizen.handle == group.value.cmdr.handle
    }
})

const route = useRoute()

const modals = ref({
    group: false,
    commander: false,
    ship: false,
    edit: false,
    confirm: false
})

const addGroup = async (group) => {
    modals.value.group = false
    console.log('adding group: ')
    console.log(group)
    const result = await $api(`/api/fleets/${props.selected}`, {
        method: 'POST',
        body: group
    })
    emit('refresh')
}

const removeGroup = async () => {
    modals.value.confirm = false
    console.log(`removing group: ${props.selected}`)
    await $api(`/api/fleets/${props.selected}`, {
        method: 'DELETE'
    })
    if (route.params.id == props.selected) {
        emit('return')
    } else {
        emit('reset')
    }
}

const updateGroup = async (group) => {
    const result = await $api(`/api/fleets/${props.selected}`, {
        method: 'PUT',
        body: group
    })
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
    const grp = group.value.info
    grp.cmdr = ''
    const result = await updateGroup(grp)
    emit('refresh')
}

const addShip = async (id) => {
    modals.value.ship = false
    console.log('adding ship:', id)
    const res = await $api(`/api/fleets/${props.selected}/assignments/add`, {
        key: 'fleetAddShip',
        method: 'POST',
        body: {
            shipID: id,
            groupID: props.selected
        }
    })
}

const removeShip = async () => {

}

const setGroup = async () => {
    status.value = 'pending'
    const res = await $api(`/api/fleets/${props.selected}`, {
        key: 'getFleetGroup',
        onRequest() {
            console.log('getFleetGroup called')
        }
    })
    console.log(res)
    if (res.status == 'success') {
        group.value = res.data
        status.value = 'success'
    } else {
        status.value = 'error'
    }
}

// Repurpose to get ships for the group.

const {status, data: ships, refresh} = await useAPI(() => `/api/fleets/${props.selected}/assignments`, {
    key: 'getFleetGroupShips',
    async onResponse({ response }) {
        //chart.value = response._data.data
        //chart.value.children = await getSubgroups()
    }
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
    <WidgetsLoading v-if="status == 'pending'"/>
    <WidgetsNoResult v-else-if="status == 'error'" text="Group not found"/>
    <div v-else class="fleet-group">
        <div class="info">
            <div class="info-panel no-grow">
                <panel :title="group.info.name" title-size="small" class="commander">
                    <div v-if="group.cmdr" class="assigned">
                        <h5>Group Commander</h5>
                        <citizen-portrait :citizen="group.cmdr" :show-name="true">
                            <div class="mask"></div>
                            <img v-if="isCmdr" @click="removeCmdr" class="edit" src="@/assets/delete.png">
                        </citizen-portrait>
                    </div>
                    <div v-else class="unassigned">
                        <h5>Group Commander</h5>
                        <div class="bg">
                            <img v-if="isCmdr" @click="modals.commander = true" src="@/assets/plus.png" class="add-new"/>
                            <div v-else class="add-new" />
                        </div>
                        <div class="name">Unassigned</div>
                    </div>
                </panel>
                <slot name="assignment"></slot>
            </div>
            <div class="info-panel">
                <panel title="Tools" title-size="small" class="tools">
                    <input v-if="isCmdr" class="tool-button" @click="modals.confirm = true" type="button" value="Delete Group">
                    <input v-if="isCmdr /*|| (canEdit && (!group.cmdr || citizen.info.handle.toLowerCase() !== group.cmdr.toLowerCase()))*/" class="tool-button" @click="modals.edit = true" type="button" value="Edit Group">
                    <input class="tool-button" @click="modals.group = true" type="button" value="Add Subgroup">
                    <input class="tool-button" @click="modals.ship = true" type="button" value="Add Ship">
                </panel>
                <ship-collection 
                    :ships="ships.data" 
                    :is-owner="isCmdr"
                    @add="addShip"
                    @remove="removeShip">
                    <panel-button v-if="isCmdr" text="Add Ship" class="add-ship" @click="modals.ship = true" />
                </ship-collection>
            </div>
        </div>
        <layout-modal v-if="modals.group" title="Add Subgroup" @close="modals.group = false">
            <forms-fleet @submit="addGroup" />
        </layout-modal>
        <layout-modal v-if="modals.confirm" title="Are you sure?" @close="modals.confirm = false" :show-close="false">
            <div class="confirm">
                <img class="button" src="@/assets/tick.png" @click="removeGroup">
                <img class="button" src="@/assets/delete.png"  @click="modals.confirm = false">
            </div>
        </layout-modal>
        <layout-modal v-if="modals.commander" title="Add Commander" @close="modals.commander = false">
            <forms-commander @submit="addCmdr" />
        </layout-modal>
        <layout-modal v-if="modals.ship" title="Add Ship" @close="modals.ship = false">
            <forms-fleet-ship :ship-pool="shipPool" @add="addShip"/>
        </layout-modal>
    </div>
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

.ship-modal {
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
  margin: auto !important;
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
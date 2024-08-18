<script setup>
const props = defineProps({
    groupID: {
        type: String,
        required: true
    }
})

const canEdit = computed({
    get() {
        return true
    }
})

const chart = ref({})
const modals = ref({
    group: false,
    commander: false,
    ship: false,
    edit: false
})

const {status, data: group, refresh} = await useAPI(`/api/fleets/${props.groupID}`, {
    onResponse({ response }) {
        chart.value = response._data.data
        chart.value.children = []
    }
})

</script>

<template>
    <WidgetsLoading v-if="status != 'success'" />
    <div v-else class="fleet-group">
        <div class="info">
            <div class="info-panel no-grow">
                <panel class="commander">
                    <div v-if="group.data.cmdr" class="assigned">
                        <h5>Group Commander</h5>
                        <citizen-portrait :citizen="group.data.cmdr" :show-name="true">
                            <div class="mask"></div>
                            <img v-if="canEdit" @click="" class="edit" src="@/assets/delete.png">
                        </citizen-portrait>
                    </div>
                    <div v-else class="unassigned">
                        <h5>Group Commander</h5>
                        <div class="bg">
                            <img v-if="canEdit" @click="modals.value.commander = true" src="@/assets/plus.png" class="add-new"/>
                            <div v-else class="add-new" />
                        </div>
                        <div class="name">Unassigned</div>
                    </div>
                </panel>
                <slot name="assignment"></slot>
            </div>
            <div class="info-panel">
                <panel :title="group.name" class="tools">
                    <input v-if="isAdmin || (canEdit && (!group.cmdr || citizen.info.handle.toLowerCase() !== group.cmdr.toLowerCase()))" class="tool-button" @click="removeGroup" type="button" value="Delete Group">
                    <input v-if="isAdmin || (canEdit && (!group.cmdr || citizen.info.handle.toLowerCase() !== group.cmdr.toLowerCase()))" class="tool-button" @click="modals.edit = true" type="button" value="Edit Group">
                    <input class="tool-button" @click="modals.value.group = true" type="button" value="Add Subgroup">
                    <input class="tool-button" @click="modals.value.ship = true" type="button" value="Add Ship">
                </panel>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fleet .info {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-right: -10px;
    opacity: 1;
}

.ship-modal {
    padding: 15px;
    max-height: 75vh;
    overflow-y: scroll;
}

.fleet .info .info-panel {
    display: flex;
    flex-direction: column;
    flex-basis: 250px;
    margin: 10px;
    flex-grow: 1;
}

.fleet .info .info-panel .group-title {
    position: relative;

}

.fleet .info .commander {
    height: fit-content;
    max-height: fit-content;
    margin: 10px;
}

.fleet .info .tools {
    display: flex;
    justify-content: center;
    flex-grow: 0;
    flex-wrap: wrap;
}

.fleet .info .tools .tool-button {
    margin: 5px;
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
    flex-basis: 120px;
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
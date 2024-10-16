<script setup>
const emit = defineEmits(['refresh', 'add', 'remove', 'edit'])
const props = defineProps({
    assignees: {
        type: Array,
        default: () => {
            return []
        }
    },
    maxAssigned: {
        type: Number,
        default: 1
    },
    defaultRole: {
        type: String,
        default: ''
    },
    edit: {
        type: Boolean,
        default: false
    }
})

const auth = useAuthStore()
const selected = ref(null)

const modal = ref({
    add: false,
    show: false
})

const assigneeList = computed({
    get() {
        const list = props.assignees
        list.length = props.maxAssigned
        return list
    }
})

const showAssignee = (c) => {
    selected.value = c
    modal.value.show = true
}

const isSelf = (c) => {
    if (auth.isAuthenticated && auth.user.verified && auth.citizen.handle.toLowerCase().trim() === c.toLowerCase().trim()) {
        return true
    }
    return false
}

const assignMember = async (member) => {
    modal.value.add = false

    emit('add', member)
}

const removeMember = async (member) => {
    emit('remove', {
        handle: member.handle
    })
}

const updateMember = async (member, role) => {
    modal.value.show = false
    emit('update', {
        handle: member.handle,
        role: role
    })
}
</script>

<template>
    <div class="assignees">
        <div v-for="(c, i) in assigneeList" :key="i" class="assignee">
            <div v-if="c" class="assigned">
                <citizen-portrait :citizen="c.citizen" size="tiny">
                    <div class="mask"  @click="showAssignee(c)"></div>
                    <img v-if="edit" @click="showAssignee(c)" class="edit" src="@/assets/edit.png">
                </citizen-portrait>
                <div class="tooltiptext">
                    <span>{{ c.citizen.name }}</span>
                    <span>{{ c.role }}</span>
                </div>
            </div>
            <div v-else class="unassigned">
                <div class="bg"></div>
                <div class="add-new"></div>
            </div>
        </div>
        <layout-modal v-if="modal.show" title="Crew Record" @close="modal.show = false">
            <assignment-member :member="selected" @remove="removeMember" @update="updateMember" :canEdit="edit"/>
        </layout-modal>
        <layout-modal v-if="modal.add" title="Add Crew" @close="modal.add = false">
            <forms-assignment :placeholder="defaultRole" @add="assignMember"/>
        </layout-modal>
    </div>
</template>

<style scoped>
.assignees {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
}

.assignees .panel-content {
    display: flex;
}

.assignee {
    margin: 0 10px;
}

.portrait .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: pointer;
}

.assigned {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.assigned .edit {
    position: absolute;
    top: -7px;
    right: -7px;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.unassigned {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 5px;
}

.unassigned .add-new {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    padding: 20px;
    border: 1px dashed #546f84;
}

.unassigned .add-new.edit {
    cursor: pointer;
}

.unassigned .bg {
    content: "";
    background: url('https://robertsspaceindustries.com/rsi/static/images/account/avatar_default_big.jpg');
    background-size: 40px 40px;
    background-repeat: no-repeat;
    opacity: 0.4;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
}

.unassigned .name {
    font-size: 12px;
}

.assigned .tooltiptext {
    display: flex;
    flex-direction: column;
    visibility: hidden;
    width: 160px;
    background-color: rgba(13, 46, 66, 0.8);
    color: #dbf3ff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    position: absolute;
    z-index: 1;
    top: calc(100% + 6px);
    left: 50%;
    margin-left: -80px;
}

.assigned:hover .tooltiptext {
    visibility: visible;
}

.assigned .tooltiptext:after {
    content: " ";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent rgba(13, 46, 66, 0.8) transparent;
}
</style>
<template>
    <div class="crew" title="Crew" title-size="medium">
        <div v-for="(c, i) in crewList" :key="i" class="crewman">
            <div v-if="c" class="assigned">
                <h5 class="role">{{ c.role }}</h5>
                <citizen-portrait :citizen="c.citizen" size="small" :showName="true">
                    <div class="mask"  @click="showCrewmember(c)"></div>
                    <img v-if="edit" @click="showCrewmember(c)" class="edit" src="@/assets/edit.png">
                    <img v-else-if="isSelf(c.citizen.handle)" @click="removeCrew(c.citizen)" class="edit" src="@/assets/delete.png">
                </citizen-portrait>
            </div>
            <div v-else class="unassigned">
                <h5 class="role">&nbsp;</h5>
                <div class="bg"/>
                <img v-if="edit" @click="modal.add = true" src="@/assets/plus.png" class="add-new edit"/>
                <div v-else class="add-new" />
                <div class="name">Unassigned</div>
            </div>
        </div>
        <layout-modal v-if="modal.show" title="Crew Record" @close="modal.show = false">
            <vehicle-crew-record :crew="selected" @remove="removeCrew" @update="updateCrew" :canEdit="edit"/>
        </layout-modal>
        <layout-modal v-if="modal.add" title="Add Crew" @close="modal.add = false">
            <forms-crew @add="addCrew"/>
        </layout-modal>
    </div>
</template>

<script setup>
const emit = defineEmits(['refresh', 'add', 'remove', 'edit'])
const props = defineProps({
    crew: {
        type: Array,
        default: () => {
            return []
        }
    },
    maxCrew: {
        type: Number,
        default: 1
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

const crewList = computed({
    get() {
        const list = props.crew
        list.length = props.maxCrew
        return list
    }
})

const showCrewmember = (c) => {
    selected.value = c
    modal.value.show = true
}

const isSelf = (c) => {
    if (auth.isAuthenticated && auth.user.verified && auth.citizen.handle.toLowerCase().trim() === c.toLowerCase().trim()) {
        return true
    }
    return false
}

const addCrew = async (crew) => {
    modal.value.add = false

    emit('add', crew)
}

const removeCrew = async (member) => {
    emit('remove', {
        handle: member.handle
    })
}

const updateCrew = async (member, role) => {
    emit('update', {
        handle: member.handle,
        role: role
    })
}

</script>

<style scoped>
.crew {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
}

.crew .panel-content {
    display: flex;
}

.crewman {
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
    flex-direction: column;
    align-items: center;
}

.assigned .edit {
    position: absolute;
    top: 20px;
    right: 5px;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.unassigned {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.unassigned .add-new {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    padding: 20px;
    border: 1px dashed #546f84;
}

.unassigned .add-new.edit {
    cursor: pointer;
}

.unassigned .bg {
    content: "";
    background: url('https://robertsspaceindustries.com/rsi/static/images/account/avatar_default_big.jpg');
    background-size: 100px 100px;
    background-repeat: no-repeat;
    background-position-y: 25px;
    opacity: 0.4;
    top: 5px;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
}

.unassigned .name {
    font-size: 12px;
}
</style>
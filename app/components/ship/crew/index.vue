<template>
    <panel title="Crew" class="crew">
        <div v-for="(c, i) in crew" :key="i" class="crewman">
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
            <ship-crew-record :crew="selected" @remove="removeCrew" @update="updateCrew" :canEdit="edit"/>
        </layout-modal>
        <layout-modal v-if="modal.add" title="Add Crew" @close="modal.add = false">
            <forms-crew-add @add="addCrew"/>
        </layout-modal>
    </panel>
</template>

<script setup>
const {$swal} = useNuxtApp()

const auth = useAuthStore()

const props = defineProps({
    ship: {
        type: Object,
        default: function () {
            return {}
        }
    },
    fleet: {
        type: Number,
        defualt: 0
    },
    edit: {
        type: Boolean,
        default: false
    }
})

const selected = ref(null)

const modal = ref({
    add: false,
    show: false
})

const showCrewmember = (c) => {
    selected.value = c
    modal.value.show = true
}

const isSelf = (c) => {
    if (props.ship.value && auth.user.verified && auth.citizen.handle.toLowerCase().trim() === c.toLowerCase().trim()) {
        return true
    }
    return false
}

const addCrew = async (crew) => {
    modal.value.add = false
    const data = {
        handle: crew.handle,
        role: crew.role
    }

    await $fetch(`/api/ships/${props.ship.id}/crew/add`, {
        key: 'addCrewmate',
        method: 'POST',
        body: data,
        onResponse({ response }) {
            const resp = handleResponse(response)
            if(resp.status == 'success') {
                $swal.fire({
                    title: "Added",
                    text: "Crewmember successfully added",
                    icon: 'success',
                    confirmButtonText: 'OK!'
                })
            } else {
                $swal.fire({
                    title: "Error",
                    text: resp._data.data,
                    icon: 'error',
                    confirmButtonText: 'OK!'
                })
            }
            
        },
        onResponseError(_ctx) {
            console.error('Add Error: ', _ctx.response._data)
        }
    })
    await refresh()
}

const removeCrew = async (member) => {
    await $fetch(`/api/ships/${props.ship.id}/crew/remove`, {
        key: 'removeCrewmate',
        method: 'POST',
        body: { handle: member.handle },
        onResponse({ response }) {
            if(response.status == 200) {
                $swal.fire({
                    title: "Removed",
                    text: "Crewmember successfully removed",
                    icon: 'success',
                    confirmButtonText: 'OK!'
                })
            } else {
                modal.value.show = false
                handleResponse(_ctx.response)
            }
        }
    }).catch((error) => {
        // probably a disconnect between client and server state. Refresh to fix.
        //reloadNuxtApp()
    })
    modal.value.show = false
    await refresh()
}

const updateCrew = async (member, role) => {
    // do me next
    await $fetch(`/api/ships/${props.ship.id}/crew/update`, {
        key: 'updateCrew',
        method: 'POST',
        body: { 
            handle: member.handle, 
            role: role 
        },
        onResponse({ response }) {
            if(response.status == 200) {
                $swal.fire({
                    title: "Updated",
                    text: "Crewmember successfully updated",
                    icon: 'success',
                    confirmButtonText: 'OK!'
                })
            } else {
                modal.value.show = false
                handleResponse(response)
            }
        }
    }).catch((error) => {
        // probably a disconnect between client and server state. Refresh to fix.
        //reloadNuxtApp()
    })
    modal.value.show = false
    await refresh()
}

//if(props.fleet) {
    // load the fleet view of the ship. Re-add this later.
//} else {
const {data: crew, pending, refresh} = await useFetch(`/api/ships/${props.ship.id}/crew`, {
    onResponse({ response }) {
        const data = getResponseData(response)
        data.length = props.ship.max_crew
        response._data = data
    }
})
//}

</script>

<style scoped>
.crew {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
}

.unassigned .name {
    font-size: 12px;
}
</style>
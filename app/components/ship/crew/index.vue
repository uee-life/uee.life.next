<template>
    <panel title="Crew" class="crew">
        <div v-for="c in crewList" :key="crew.handle" class="crewman">
            <div v-if="c" class="assigned">
                <h5 class="role">{{ c.role }}</h5>
                <citizen-portrait :handle="c.citizen" size="small" :showName="true">
                    <div class="mask"  @click="showCrewmember(c)"></div>
                    <img v-if="edit" @click="showCrewmember(c)" class="edit" src="@/assets/edit.png">
                    <img v-else-if="isSelf(c.citizen)" @click="removeCrew(c.id)" class="edit" src="@/assets/delete.png">
                </citizen-portrait>
            </div>
            <div v-else class="unassigned">
                <h5 class="role">&nbsp;xxx</h5>
                <div class="bg"/>
                <img v-if="edit" @click="showModal = true" src="@/assets/plus.png" class="add-new"/>
                <div v-else class="add-new" />
                <div class="name">Unassigned</div>
            </div>
        </div>
    </panel>
</template>

<script setup>
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

const user = useUser()

const showModel = ref(false)
const showCrew = ref(false)
//const crew = ref(null)
const selected = ref(null)

const showCrewmember = (c) => {
    this.selected.value = c
    this.showCrew.value = true
}

const isSelf = (c) => {
    if (props.ship.value && user.handle_verified && user.handle.toLowerCase().trim() === c.toLowerCase().trim()) {
        return true
    }
    return false
}

const crewList = computed({
    get() {
        console.log(props.ship)
        const list = crew.value
        list.length = props.ship.max_crew
    }
})

//if(props.fleet) {
    // load the fleet view of the ship. Re-add this later.
//} else {
const {data: crew, pending} = await useFetch(`/api/ship/${props.ship.id}/crew`)
//}

</script>

<style scoped>
.crew {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
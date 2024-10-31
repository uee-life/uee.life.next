<script setup>
const { $api } = useNuxtApp()
const auth = useAuthStore()

const emit = defineEmits(['refresh'])
const props = defineProps({
    vehicle: {
        type: Object,
        required: true
    }
})

const edit = ref({
    name: false
})

const name = ref(props.vehicle.name)

const isOwner = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && auth.citizen.handle.toLowerCase().trim() == props.vehicle.owner.handle.toLowerCase().trim()
    }
})

const regDate = computed({
    get() {
        return neo4jToStandardDatetime(props.vehicle.registered)
    }
})

//TODO: Update this to make the change...
async function updateName() {
    console.log("updating vehicle name to: ", name.value)
    edit.value.name = false
    await $api(`/api/vehicles/${props.vehicle.id}/update`, {
        method: 'POST',
        body: {
            name: name.value
        }
    })
    emit('refresh')
}
</script>

<template>
    <div>
        <div class="vehicle-info">
            <panel title="Registration" titleSize="small" class="info-panel">
                <layout-info :items="{
                    ship_id: vehicleID(vehicle.id),
                    reg_date: ueeDate(regDate),
                    name: ''
                    }">
                    <template v-slot:name>
                        <span v-if="edit.name">
                            <input type="text" v-model="name" maxlength="30" />
                            <img class="button" title="submit" src="@/assets/tick.png" @click="updateName()"/>
                            <img class="button" title="cancel" src="@/assets/delete.png" @click="edit.name = false"/>
                        </span>
                        <span v-else>{{ vehicle.name ? vehicle.name : 'Not Provided' }}<img v-if="isOwner" class="button" @click="edit.name = true" src="@/assets/edit.png"/></span>
                    </template>
                
                </layout-info>
            </panel>
        </div>
    </div>
</template>

<style scoped>
.vehicle-info {
    display: flex;
    flex-wrap: wrap;
    max-width: calc(100vw - 20px);
    column-gap: 20px;
}

.info-panel {
    flex-basis: 250px;
    flex-grow: 1;
    padding-left: 15px;
    margin-bottom: 20px;
}

.info-items {
    display: flex;
    font-size: 14px;
    text-transform: uppercase;
}

.info-items .labels {
    display: flex;
    flex-direction: column;
}

.info-items .labels span {
    display: flex;
    width: fit-content;
}

.info-items .data {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    color: #dbf3ff;
}

.info-items .data span {
    display: flex;
}

.button {
    position: absolute;
    width: 18px;
    height: 18px;
    margin-left: 5px;
    cursor: pointer;
}
.owner {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
</style>
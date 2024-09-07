<template>
    <div>
        <ClientOnly>
            <teleport to="#left-dock">
                <panel-dock v-if="ship" title="owner" class="owner">
                    <citizen-portrait :citizen="ship.owner" :showName="true"></citizen-portrait>
                </panel-dock>
            </teleport>
        </ClientOnly>
        <div class="ship-info">
            <panel title="Registration" titleSize="small" class="info-panel">
                <div class="info-items">
                    <div class="labels">
                        <span>Ship ID:</span>
                        <span>Reg Date:</span>
                        <span>Name:</span>
                    </div>
                    <div class="data">
                        <span>{{ shipID(ship.id) }}</span>
                        <span>{{ ueeDate(regDate) }}</span>
                        <span v-if="edit.name">
                            <input type="text" v-model="name" maxlength="30" />
                            <img class="button" title="submit" src="@/assets/tick.png" @click="updateName()"/>
                            <img class="button" title="cancel" src="@/assets/delete.png" @click="edit.name = false"/>
                        </span>
                        <span v-else>{{ ship.name ? ship.name : 'Not Provided' }}<img v-if="isOwner" class="button" @click="edit.name = true" src="@/assets/edit.png"/></span>
                    </div>
                </div>
            </panel>
            <panel title="Hull Info" titleSize="small" class="info-panel">
                <div class="info-items">
                    <div class="labels">
                        <span>Manufacturer:</span>
                        <span>Model:</span>
                        <span>Size:</span>
                        <span>Role:</span>
                    </div>
                    <div class="data">
                        <span>{{ ship.manufacturer }}</span>
                        <span>{{ ship.model }}</span>
                        <span>{{ ship.size }}</span>
                        <span>{{ `${ship.career} - ${ship.role}` }}</span>
                    </div>
                </div>
            </panel>
            <panel title="Metrics" titleSize="small" class="info-panel">
                <div class="info-items">
                    <div class="labels">
                        <span>Max Crew:</span>
                        <span>Max Cargo:</span>
                    </div>
                    <div class="data">
                        <span>{{ ship.max_crew }}</span>
                        <span>{{ ship.cargo }}</span>
                    </div>
                </div>
            </panel>
        </div>
    </div>
</template>

<script setup>

const auth = useAuthStore()

const props = defineProps({
    ship: {
        type: Object,
        required: true
    },
    fleet: {
        type: Number,
        default: 0
    },
    cmdrs: {
        type: Array,
        default: function () {
            return []
        }
    }
})

const edit = ref({
    name: false
})

const name = ref('')

const isOwner = computed({
    get() {
        return auth.isAuthenticated && auth.user.verified == 1 && auth.citizen.handle.toLowerCase().trim() == props.ship.owner.handle.toLowerCase().trim()
    }
})

const regDate = computed({
    get() {
        return neo4jToStandardDatetime(props.ship.registered)
    }
})

function updateName() {
    console.log("updating ship name to: ", name.value)
    edit.value.name = false
}
</script>

<style scoped>
.ship-info {
    display: flex;
    flex-wrap: wrap;
    margin: 10px -10px;
}

.info-panel {
    flex-basis: 250px;
    flex-grow: 1;
    margin: 0 10px;
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

.info-items .data .button {
    position: relative;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    cursor: pointer;
}
.owner {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
</style>
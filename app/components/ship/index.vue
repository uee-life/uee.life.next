<template>
    <div>
        <ClientOnly>
            <teleport to="#left-dock">
                <panel-dock title="Fleet"></panel-dock>
                <panel-dock v-if="ship" title="owner" class="owner">
                    <citizen-portrait :citizen="ship.owner" :showName="true"></citizen-portrait>
                </panel-dock>
            </teleport>
        </ClientOnly>
        <layout-banner 
            :name="ship.model"
            :tag="ship.name"
            :type="ship.career + ' / ' + ship.role"
            :image="`/images/ships/${ship.identifier}.jpg`"
            :logo="`/images/manufacturers/${ship.manufacturer}.png`"/>
        <div class="ship-info">
            <panel title="Registration" titleSize="small" class="info-panel">
                <div class="info-items">
                    <div class="labels">
                        <span>Ship ID:</span>
                        <span>Reg Date:</span>
                        <span>Name:</span>
                    </div>
                    <div class="data">
                        <span>{{shipID(ship.id)}}</span>
                        <span>{{ ueeDate(regDate) }}</span>
                        <span>{{ ship.name ? ship.name : 'Not Provided' }}</span>
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
            <panel title="Metrics" class="info-panel">
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
        <ship-crew />
    </div>
</template>

<script setup>

const props = defineProps({
    ship: {
        type: Object,
        required: true
    }
})

const regDate = computed({
    get() {
        return neo4jToStandardDatetime(props.ship.registered)
    }
})
</script>

<style scoped>
.ship-info {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
}

.info-panel {
    flex-basis: 250px;
    flex-grow: 1;
    margin: 0 10px;
    padding-left: 15px;
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
.info-items .data {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    color: #dbf3ff;
}
.owner {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
</style>
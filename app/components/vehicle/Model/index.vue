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

</script>

<template>
    <div>
        <div class="vehicle-info">
            <panel title="Registration" titleSize="small" class="info-panel">
                <div class="info-items">
                    <div class="labels">
                        <span>Ship ID:</span>
                        <span>Name:</span>
                    </div>
                    <div class="data">
                        <span>{{ '#'+vehicle.id }}</span>
                        <span>{{ vehicle.name }}</span>
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
                        <span>{{ vehicle.manufacturer }}</span>
                        <span>{{ vehicle.model }}</span>
                        <span>{{ vehicle.size }}</span>
                        <span>{{ `${vehicle.career} - ${vehicle.role}` }}</span>
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
                        <span>{{ vehicle.max_crew }}</span>
                        <span>{{ vehicle.cargo }}</span>
                    </div>
                </div>
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
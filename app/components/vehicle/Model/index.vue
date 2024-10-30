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

const model = ref(props.vehicle)
const hardpoints = JSON.parse(props.vehicle.hardpoints)

const parseSlots = (data) => {
    let slots = ""
    for (const slot of Object.keys(data)) {
        if (data[slot] > 0) {
            if (slots) {
                slots = slots.concat(', ')
            }
            slots = slots.concat(`${data[slot]}xS${slot}`)
        }
    }
    if (slots) {
        return slots
    } else {
        return 'None'
    }
}
//model.value.hardpoints = JSON.parse(props.vehicle.hardpoints)

</script>

<template>
    <div>
        <div class="vehicle-info">
            <panel title="Hull" titleSize="small" class="info-panel medium">
                <layout-info :items="{
                    Make: vehicle.manufacturer,
                    model: vehicle.model,
                    role: `${vehicle.career} - ${vehicle.role}`,
                }" />
                <layout-info :items="{
                    crew: vehicle.max_crew,
                    seats: hardpoints.seats,
                    escape_pods: hardpoints.escape_pods,
                    cargo: vehicle.cargo
                }" />
            </panel>
            <panel title="Engineering" title-size="small" class="info-panel small">
                <layout-info 
                    :items="{
                        speed: `${vehicle.speed_scm}m/s (${vehicle.speed_max}m/s max)`,
                        h_fuel: vehicle.fuel_hydro,
                    }"
                    :icons="{
                        speed: 'thrusters',
                        h_fuel: 'empty',
                    }" />
                <layout-info 
                    :items="{
                        q_drive: parseSlots(hardpoints.qdrives),
                        q_fuel: vehicle.fuel_quant
                    }"
                    :icons="{
                        q_drive: 'quantum-drives',
                        q_fuel: 'empty'
                    }" />
                <layout-info 
                    :items="{
                        power: parseSlots(hardpoints.powerplants),
                        cooling: parseSlots(hardpoints.coolers)
                    }"
                    :icons="{
                        power: 'power',
                        cooling: 'cooling'
                    }"/>
                <!--layout-info 
                    :items="{
                        relays: vehicle.hardpoints.relays,
                        extinguishers: vehicle.hardpoints.extinguishers
                    }"
                    :icons="{
                        relays: 'empty',
                        extinguisers: 'empty'
                    }"/-->
            </panel>
            <panel title="Tactical" title-size="small" class="info-panel">
                <layout-info :items="{
                    weapons: parseSlots(hardpoints.weapons),
                    turrets: parseSlots(hardpoints.turrets),
                    missiles: parseSlots(hardpoints.missiles),
                    counters: hardpoints.countermeasures
                }" :icons="{
                    weapons: 'weapons',
                    turrets: 'turrets',
                    missiles: 'missiles',
                    counters: 'empty'
                }"/>
                <layout-info 
                    :items="{
                        armor: vehicle.armor,
                        shield: `${parseSlots(hardpoints.shields)} (${vehicle.shield_type})`
                    }"
                    :icons="{
                        armor: 'armor',
                        shield: 'shields'
                    }" />
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

.info-panel.small {
    flex-basis: auto;
    flex-grow: 1;
    margin-bottom: 20px;
}

.info-panel.small {
    flex-basis: 250px;
}

.info-panel.medium {
    flex-basis: 300px;
}

.info-panel.large {
    flex-basis: 400px;
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
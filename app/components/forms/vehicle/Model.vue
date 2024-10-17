<script setup>
const { $api } = useNuxtApp()

const props = defineProps({
    vehicleInfo: {
        type: Object,
        default: function () {
            return {
                manufacturer: '',
                model: '',
                career: '',
                role: '',
                size: 0,
                max_crew: 0,
                cargo: 0,
                armor: '',
                speed_scm: 0,
                speed_max: 0,
                shield_type: '',
                fuel_hydro: 0,
                fuel_quant: 0,
                description: '',
                hardpoints: JSON.stringify({
                    countermeasures: 0,
                    fire_extinguishers: 0,
                    relays: 0,
                    escape_pods: 0,
                    seats: 0,
                    tractors: 0,
                    powerplants: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0
                    },
                    coolers: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0
                    },
                    qdrives: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0
                    },
                    shields: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0
                    },
                    weapons: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    },
                    turrets: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    },
                    missiles: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    }
                })
            }
        }
    }
})
const isUpdate = ref(false)
if (props.vehicleInfo.manufacturer) {
    isUpdate.value = true
}

const emit = defineEmits(['submit', 'close'])

const vehicleModel = ref(props.vehicleInfo)
const hardpoints = ref(JSON.parse(vehicleModel.value.hardpoints))


const careers = ref([])
const roles = ref([])
const sizes = ref([])

function identifier() {
    return `${vehicleModel.value.manufacturer}_${vehicleModel.value.model.split(' ').join('_')}`.toLowerCase()
}

const submit = async () => {
    vehicleModel.value.identifier = identifier()
    vehicleModel.value.hardpoints = JSON.stringify(hardpoints.value)
    await $api('/api/admin/vehicles/add', {
        method: 'POST',
        body: vehicleModel.value
    })

    emit('close')
}

const {data, status} = useAPI('/api/vehicles/models', {
    key: 'getVehicleModels',
    server: false,
    lazy: true,
    onResponse({response}) {
        console.log(response._data.data)
        careers.value = [...new Set(response._data.data.models.map(a => a.career))]
        roles.value = [...new Set(response._data.data.models.map(a => a.role))]
        sizes.value = [...new Set(response._data.data.models.map(a => a.size))]
    }
})
</script>

<template>
    <widgets-loading v-if="status != 'success'" />
    <form v-else @submit.prevent="submit" class="model-form">
        <table>
            <tr class="field">
                <td><label for="manufacturer">Manufacturer:</label></td>
                <td><select v-model="vehicleModel.manufacturer" id="manufacturer" :disabled="isUpdate" class="input">
                    <option disabled value="">Select Manufacturer</option>
                    <option v-for="m in data.data.makes" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select></td>
            </tr>
            <tr class="field">
                <td><label for="model">Model:</label></td>
                <td><input type="text" v-model="vehicleModel.model" id="model" :disabled="isUpdate" class="input"></td>
            </tr>
            <tr class="field">
                <td><label for="identifier">Identifier:</label></td>
                <td><span id="identifer">{{ identifier() }}</span></td>
            </tr>
            <tr class="field">
                <td><label for="career">Career</label></td>
                <td><input v-model="vehicleModel.career" type="text" name="career" id="career" list="careerlist" class="input">
                <datalist id="careerlist">
                    <option v-for="(c, i) in careers">{{ c }}</option>
                </datalist></td>
            </tr>
            <tr class="field">
                <td><label for="role">Role</label></td>
                <td><input v-model="vehicleModel.role" type="text" name="role" id="role" list="rolelist" class="input">
                <datalist id="rolelist">
                    <option v-for="(c, i) in roles">{{ c }}</option>
                </datalist></td>
            </tr>
            <tr class="field">
                <td><label for="size">Size:</label></td>
                <td><select v-model="vehicleModel.size" id="size" class="input">
                    <option v-for="s in sizes.sort()">{{ s }}</option>
                </select></td>
            </tr>
            <tr class="field">
                <td><label for="crew">Max Crew:</label></td>
                <td><input type="number" v-model="vehicleModel.max_crew" id="crew" class="input"></td>
            </tr>
            <tr class="field">
                <td><label for="cargo">Armor:</label></td>
                <td><select v-model="vehicleModel.armor" id="cargo" class="input">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                    <option>Capital</option>
                </select></td>
            </tr>
            <tr class="field">
                <td><label for="model">SCM Speed:</label></td>
                <td><input type="number" v-model="vehicleModel.speed_scm" id="model" class="input"></td>
            </tr>
            <tr class="field">
                <td><label for="model">Max Speed:</label></td>
                <td><input type="number" v-model="vehicleModel.speed_max" id="model" class="input"></td>
            </tr>
            <tr class="field">
                <td><label for="model">Sheild Type:</label></td>
                <td><input type="text" v-model="vehicleModel.shield_type" id="model" class="input"></td>
            </tr>
            <tr class="field">
                <td><label for="model">Hydro Fuel:</label></td>
                <td><input type="number" v-model="vehicleModel.fuel_hydro" id="model" class="input"></td>
            </tr>
            <tr class="field">
                <td><label for="model">Quantum Fuel:</label></td>
                <td><input type="number" v-model="vehicleModel.fuel_quant" id="model" class="input"></td>
            </tr>
            <label for="description">Description</label><br>
            <textarea v-model="vehicleModel.description" id="description" rows="10" class="input"></textarea><br>
        </table>
        <input type="submit" value="OK" />
    </form>
</template>

<style scoped>
.model-form {
    width: 400px;
}
.field {
    display: flex;
    justify-content: space-between;
}
.input {
    width: 100%;
}
</style>
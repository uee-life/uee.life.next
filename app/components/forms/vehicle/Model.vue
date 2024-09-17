<script setup>
    const props = defineProps({
        data: {
            type: Object,
            required: true
        },
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
                    description: '',
                }
            }
        }
    })
    const isUpdate = ref(false)
    if (props.vehicleInfo.manufacturer) {
        isUpdate.value = true
    }

    const emit = defineEmits(['submit'])

    const vehicleModel = ref(props.vehicleInfo)


    const careers = [...new Set(props.data.models.map(a => a.career))]
    const roles = [...new Set(props.data.models.map(a => a.role))]
    const sizes = [...new Set(props.data.models.map(a => a.size))]

    function identifier() {
        return `${vehicleModel.value.manufacturer}_${vehicleModel.value.model.split(' ').join('_')}`.toLowerCase()
    }

    function submit() {
        vehicleModel.value.identifier = identifier()
        emit('submit', vehicleModel.value)
    }
</script>

<template>
    <form @submit.prevent="submit">
        <span class="field">
            <label for="manufacturer">Manufacturer:</label>
            <select v-model="vehicleModel.manufacturer" id="manufacturer" :disabled="isUpdate">
                <option disabled value="">Select Manufacturer</option>
                <option v-for="m in data.makes" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
        </span>
        <span class="field">
            <label for="model">Model:</label>
            <input type="text" v-model="vehicleModel.model" id="model" :disabled="isUpdate">
        </span>
        <span class="field">
            <label for="identifier">Identifier:</label>
            <span id="identifer">{{ identifier() }}</span>
        </span>
        <span class="field">
            <label for="career">Career</label>
            <input v-model="vehicleModel.career" type="text" name="career" id="career" list="careerlist">
            <datalist id="careerlist">
                <option v-for="(c, i) in careers">{{ c }}</option>
            </datalist>
        </span>
        <span class="field">
            <label for="role">Role</label>
            <input v-model="vehicleModel.role" type="text" name="role" id="role" list="rolelist">
            <datalist id="rolelist">
                <option v-for="(c, i) in roles">{{ c }}</option>
            </datalist>
        </span>
        <span class="field">
            <label for="size">Size:</label>
            <select v-model="vehicleModel.size" id="size">
                <option v-for="s in sizes.sort()">{{ s }}</option>
            </select>
        </span>
        <span class="field">
            <label for="crew">Max Crew:</label>
            <input type="number" v-model="vehicleModel.max_crew" id="crew">
        </span>
        <span class="field">
            <label for="cargo">Cargo:</label>
            <input type="number" v-model="vehicleModel.cargo" id="cargo">
        </span>
        <label for="description">Description</label>
        <textarea v-model="vehicleModel.description" id="description" rows="10"></textarea>
        <input type="submit" value="OK" />
    </form>
</template>

<style scoped>
.field {
    display: flex;
    justify-content: space-between;
}
</style>
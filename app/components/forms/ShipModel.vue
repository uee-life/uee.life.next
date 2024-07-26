<script setup>
    const props = defineProps({
        data: {
            type: Object,
            required: true
        },
        shipInfo: {
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
    if (props.shipInfo.manufacturer) {
        isUpdate.value = true
    }

    const emit = defineEmits(['submit'])

    const shipModel = ref(props.shipInfo)


    const careers = [...new Set(props.data.models.map(a => a.career))]
    const roles = [...new Set(props.data.models.map(a => a.role))]
    const sizes = [...new Set(props.data.models.map(a => a.size))]

    function identifier() {
        return `${shipModel.value.manufacturer}_${shipModel.value.model.split(' ').join('_')}`.toLowerCase()
    }

    function submit() {
        shipModel.value.identifier = identifier()
        emit('submit', shipModel.value)
    }
</script>

<template>
    <form @submit.prevent="submit" class="ship-form">
        <span class="field">
            <label for="manufacturer">Manufacturer:</label>
            <select v-model="shipModel.manufacturer" id="manufacturer" :disabled="isUpdate">
                <option disabled value="">Select Manufacturer</option>
                <option v-for="m in data.makes" :key="m.tag" :value="m.tag">{{ m.name }}</option>
            </select>
        </span>
        <span class="field">
            <label for="model">Model:</label>
            <input type="text" v-model="shipModel.model" id="model" :disabled="isUpdate">
        </span>
        <span class="field">
            <label for="identifier">Identifier:</label>
            <span id="identifer">{{ identifier() }}</span>
        </span>
        <span class="field">
            <label for="career">Career</label>
            <input v-model="shipModel.career" type="text" name="career" id="career" list="careerlist">
            <datalist id="careerlist">
                <option v-for="(c, i) in careers">{{ c }}</option>
            </datalist>
        </span>
        <span class="field">
            <label for="role">Role</label>
            <input v-model="shipModel.role" type="text" name="role" id="role" list="rolelist">
            <datalist id="rolelist">
                <option v-for="(c, i) in roles">{{ c }}</option>
            </datalist>
        </span>
        <span class="field">
            <label for="size">Size:</label>
            <select v-model="shipModel.size" id="size">
                <option v-for="s in sizes.sort()">{{ s }}</option>
            </select>
        </span>
        <span class="field">
            <label for="crew">Max Crew:</label>
            <input type="number" v-model="shipModel.max_crew" id="crew">
        </span>
        <span class="field">
            <label for="cargo">Cargo:</label>
            <input type="number" v-model="shipModel.cargo" id="cargo">
        </span>
        <label for="description">Description</label>
        <textarea v-model="shipModel.description" id="description" rows="10"></textarea>
        <input type="submit" value="OK" />
    </form>
</template>

<style scoped>
.field {
    display: flex;
    justify-content: space-between;
}
</style>
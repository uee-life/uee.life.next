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

    const shipModel = ref(props.shipInfo)


    const careers = [...new Set(props.data.models.map(a => a.career))]
    const roles = [...new Set(props.data.models.map(a => a.role))]
    const sizes = [...new Set(props.data.models.map(a => a.size))]

    /*const identifier = computed({
        get() {
            return `${shipModel.value.manufacturer}_${shipModel.value.model.split(' ').join('_')}`.toLowerCase()
        }
    })*/

    function identifier() {
        return `${shipModel.value.manufacturer}_${shipModel.value.model.split(' ').join('_')}`.toLowerCase()
    }

    function addShip() {
        console.log('Adding ship: ' + identifier())
        shipModel.value.identifier = identifier()
        console.log(shipModel.value)
    }
</script>

<template>
    <form @submit.prevent="addShip()" class="ship-form">
        <span class="field">
            <label for="manufacturer">Manufacturer:</label>
            <select v-model="shipModel.manufacturer" id="manufacturer">
                <option disabled value="">Select Manufacturer</option>
                <option v-for="m in data.makes" :key="m.tag" :value="m.tag">{{ m.name }}</option>
            </select>
        </span>
        <span class="field">
            <label for="model">Model:</label>
            <input type="text" v-model="shipModel.model" id="model">
        </span>
        <span class="field">
            <label for="identifier">Identifier:</label>
            <span id="identifer">{{ identifier() }}</span>
        </span>
        <span class="field">
            <label for="career">Career</label>
            <select v-model="shipModel.career" id="career">
                <option disabled value="">Select Career</option>
                <option v-for="(c, i) in careers">{{ c }}</option>
            </select>
        </span>
        <span class="field">
            <label for="role">Role</label>
            <select v-model="shipModel.role" id="role">
                <option disabled value="">Select Role</option>
                <option v-for="(c, i) in roles">{{ c }}</option>
            </select>
        </span>
        <span class="field">
            <label for="size">Size:</label>
            <select v-model="shipModel.size" id="size">
                <option v-for="s in sizes">{{ s }}</option>
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
        <textarea v-model="shipModel.description" id="description"></textarea>
        <input type="submit" value="Add" />
    </form>
</template>

<style scoped>
.field {
    display: flex;
    justify-content: space-between;
}
</style>
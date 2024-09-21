<template>
    <div class="crew-record">
        <citizen-portrait :citizen="crew.citizen" :showName="true">
        </citizen-portrait>
        <div class="info">
            <div class="info-item">
                <span class="label">Role:</span>
                <span v-if="edit.role" class="value">
                    <input type="text" v-model="role" maxlength="20" />
                    <img @click="$emit('update', crew.citizen, role)" class="edit-button save" title="save" src="@/assets/tick.png">
                    <img @click="edit.role = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
                </span>
                <span v-else class="value">{{ crew.role }}<img v-if="canEdit" @click="edit.role = true" class="edit-button edit" src="@/assets/edit.png"></span>
            </div>
            <div v-if="crew.joined" class="info-item">
                <span class="label">Joined:</span>
                <span class="value">{{ ueeDate(crew.joined) }}</span>
            </div>
        </div>
        <div v-if="canEdit" class="actions">
            <input type="button" class="remove" @click="$emit('remove', crew.citizen)" value="Remove" />
        </div>
    </div>   
</template>

<script setup>
const props = defineProps({
    crew: {
        type: Object,
        required: true
    },
    canEdit: {
        type: Boolean,
        default: false
    }
})

const role = ref('')
const edit = ref({
    role: false
})
</script>

<style scoped>
.crew-record {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 300px;
    height: 280px;
}

.crew-record .info {
    width: calc(100% - 20px);
}

.info-item {
    display: flex;
    margin: 0;
}

.info-item .label {
    width: 60px;
}

.actions {
    display: flex;
    margin: 5px;
}

.actions input {
    margin: 5px;
}
.actions .remove {
    color: red;
    border-color: red;
}
</style>
<script setup>
const { $api } = useNuxtApp()
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['refresh'])

const itemString = computed({
    get() {
        const parts = props.name.split(':')
        return `${parts[1]} // ${parts[2]}`
    }
})

function isValid(date) {
    if (new Date(date) > new Date()) {
        return true
    }
    return false
}

async function remove() {
    await $api(`/api/admin/cache/remove`, {
        method: 'POST',
        body: { 
            item: props.name 
        },
        onResponse() {
            emit('refresh')
        }
    })
}

</script>

<template>
    <panel :title="itemString" title-size="small">
        <div class="cache">
            <div>Item: {{ name.split(':')[3] }}</div>
            <div>Expires: {{ new Date(value.expires).toLocaleString() }}</div>
            <div>Status: {{ isValid(value.expires) ? 'Valid' : 'Expired' }}</div>
        </div>
        <img title="Remove Cache" class="delete" @click="remove" src="@/assets/delete.png">
    </panel>
</template>

<style scoped>
.delete {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    z-index: 20;
    cursor: pointer;
}
</style>
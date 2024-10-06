<script setup>
const { $api } = useNuxtApp()

const props = defineProps({
    org: {
        type: Object,
        required: true
    }
})

const founders = ref([])

async function getFounder(handle) {
    await $api(`/api/citizens/${handle}`, {
        key: 'getFounder',
        server: false,
        lazy: true,
        async onResponse(_ctx) {
            const citizen = _ctx.response._data.data
            founders.value.push(citizen)
        }
    })
}

async function loadFounders() {
        for (let i in props.org.founders) {
            await getFounder(props.org.founders[i].handle)
        }
}

loadFounders()

</script>

<template>
    <div class="info">
        <client-only>
            <panel class="info-panel" title="roles" title-size="small">
                <layout-info :items='{
                    "Primary Role": org.roles.primary,
                    "Secondary Role": org.roles.secondary
                    }'/>
            </panel>
            <panel class="info-panel" title="headquarters" title-size="small">
                <layout-info :items='{
                    "System": "Unknown",
                    "Planet": "Unknown",
                    "Location": "Unknown"
                    }'/>
            </panel>
            <panel class="info-panel" title="founders" title-size="small">
                <div class="founders">
                    <citizen-portrait class="founder" v-for="f in founders" :key="f.handle" :citizen="f" size="small" :showName="true" />
                </div>
            </panel>
        </client-only>
    </div>
</template>

<style scoped>

.info {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 20px);
    padding-top: 10px;
    margin-left: -10px;
    margin-right: -10px;
    opacity: 1;
}

.info .info-panel {
    flex-basis: 250px;
    margin-left: 10px;
    margin-right: 10px;
    flex-grow: 1;
}

.founders {
    display: flex;
    flex-wrap: wrap;
    height: fit-content;
}

.founders .founder {
    margin: 5px 10px;
}

.founder img {
    width: 100px;
}
</style>
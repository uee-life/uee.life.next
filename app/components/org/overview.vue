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
        <panel title="roles" class="info-panel">
            <div class="info-items">
                <div class="labels">
                    <span>Primary Role:</span>
                    <span>Secondary Role:</span>
                </div>
                <div class="data">
                    <span>{{ org.roles.primary }}</span>
                    <span>{{ org.roles.secondary }}</span>
                </div>
            </div>
        </panel>
        <panel title="headquarters" class="info-panel">
            <div class="info-items">
                <div class="labels">
                    <span>System:</span>
                    <span>Planet:</span>
                    <span>Location:</span>
                </div>
                <div class="data">
                    <span>Unknown</span>
                    <span>Unknown</span>
                    <span>Unknown</span>
                </div>
            </div>
        </panel>
        <panel title="founders" class="info-panel">
            <div class="founders">
                <citizen-portrait class="founder" v-for="f in founders" :key="f.handle" :citizen="f" size="small" :showName="true" />
            </div>
        </panel>
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

ul.info-items {
    padding-left: 0;
    margin: 0 20px 0 20px;
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

.info .line-item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-left: 0px;
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
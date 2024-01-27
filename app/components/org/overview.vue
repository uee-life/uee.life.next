<template>
    <div class="info">
        <panel-main title="roles" class="info-panel">
            <ul class="info-items">
                <li v-if="org.roles" class="line-item"><span>Primary Role</span><span>{{ org.roles.primary }}</span></li>
                <li v-if="org.roles" class="line-item"><span>Secondary Role</span><span>{{ org.roles.secondary }}</span></li>
            </ul>
        </panel-main>
        <panel-main title="headquarters" class="info-panel">
            <ul class="info-items">
                <li class="line-item"><div>System</div><div>Unknown</div></li>
                <li class="line-item"><div>Planet</div><div>Unknown</div></li>
                <li class="line-item"><div>City:</div><div>Unknown</div></li>
            </ul>
        </panel-main>
        <panel-main title="founders" class="info-panel">
            <div class="founders">
                <citizen-portrait class="founder" v-for="f in founders" :key="f.handle" :citizen="f" size="small" :showName="true" />
            </div>
        </panel-main>
    </div>
</template>

<script setup>

const props = defineProps({
    org: {
        type: Object,
        required: true
    }
})

const founders = ref([])

async function addFounder(handle) {
    await useFetch(`/api/citizen/${handle}`, {
        key: 'getFounder',
        server: false,
        lazy: true,
        async onResponse(_ctx) {
            const citizen = _ctx.response._data
            founders.value.push(citizen)
        }
    })
}

async function loadFounders() {
        for (let i in props.org.founders) {
            await addFounder(props.org.founders[i].handle)
        }
}

loadFounders()

</script>

<style>

.info {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 20px);
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

.founders .portrait {
    margin: 5px 10px;
}

.founder img {
    width: 100px;
}
</style>
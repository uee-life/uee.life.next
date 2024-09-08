<template>
    <div class="fleet-summary">
        <panel title="Summary" title-size="medium">
            <div class="view-controls">
                <div class="display-style">
                    <template v-if="!isMobile">
                        Summarize by: 
                            <a class="select" @click="summarize('career')">Career</a> | 
                            <a class="select" @click="summarize('role')">Role</a> | 
                            <a class="select" @click="summarize('make')">make</a> | 
                            <a class="select" @click="summarize('model')">model</a> | 
                            <a class="select" @click="summarize('size')">size</a>
                    </template>
                </div>
            </div>
            <div class="summaries">
                <div class="summary" @click="setFilter(key)" v-for="(val, key) in summary" :key="key"><span class="key">{{key}}: </span> <span class="value">{{val}}</span></div>
                <div class="summary" @click="setFilter('')"><span class="key">Total: </span><span class="value">{{fleet.length}}</span></div>
            </div>
        </panel>
    </div>
</template>

<script setup>
const emit = defineEmits(['filter'])
const props = defineProps({
    fleet: {
        type: Array,
        default: []
    }
})

const summary_type = ref('type')
const summary = ref({})
const isMobile = ref(false)

function summarize(type) { 
    summary_type.value = type
    summary.value = {}
    for(var i in props.fleet) {
        const ship = props.fleet[i]
        if(!Object.keys(summary.value).includes(ship[type])) {
            this.summary[ship[type]] = 1
        } else {
            this.summary[ship[type]] += 1
        }
    }
}

function setFilter(value) {
    emit('filter', value)
}
</script>

<style scoped>
.select {
    cursor: pointer;
}
.summaries {
    display: flex;
    flex-wrap: wrap;
}
.summary {
    display: flex;
    flex-basis: 150px;
    flex-grow: 1;
    border: 1px solid #546f84;
    margin: 5px;
    padding: 5px;
    font-family: 'Michroma';
    justify-content: space-between;
    white-space: nowrap;
    cursor: pointer;
}
.summary .value {
    color: #dbf3ff;
}
</style>
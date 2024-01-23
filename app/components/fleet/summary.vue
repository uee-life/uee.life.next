<template>
    <div class="fleet-summary">
        <panel-main title="Summary">
            <div class="view-controls">
                <div class="display-style">
                    <template v-if="!isMobile">
                        Summarize by: 
                            <a class="select" @click="summarize('type')">type</a> | 
                            <a class="select" @click="summarize('focus')">focus</a> | 
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
        </panel-main>
    </div>
</template>

<script>
export default {
    name: "FleetSummary",
    props: {
        fleet: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            summary_type: 'type',
            summary: {}
        }
    },
    methods: {
        summarize(type) { 
            this.summary_type = type
            this.summary = {}
            for(var i in this.fleet) {
                const ship = this.fleet[i]
                if(!Object.keys(this.summary).includes(ship[type])) {
                    this.summary[ship[type]] = 1
                } else {
                    this.summary[ship[type]] += 1
                }
            }
        },
        setFilter(value) {
            this.$emit('filter', value)
        }
    },
    mounted() {
        this.summarize('type')
    }
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
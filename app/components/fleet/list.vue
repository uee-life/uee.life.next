<template>
    <div class="ship-list">
        <div class="view-controls">
            <div class="display-style" v-if="showControls">
                <template v-if="!isMobile">Display: <a @click="show('large')">Large</a> | <a @click="show('small')">Small</a> | <a @click="show('table')">Table</a></template>
            </div>
            <div class="filter">
                <input class="filter-box" type="text" v-model="search" placeholder="Filter list..." />
            </div>
        </div>
        <div v-if="ships.length > 0" class="ships">
            <template v-if="isMobile || display == 'small'">
                <ship-summary-small @selected="selected" v-for="(s, index) in filteredShips" :key="s.id" :ship="s" :index="index" :isAdmin="isAdmin" @remove="remove" />
            </template>
            <template v-else-if="display == 'table'">
                <ship-table  @selected="selected" :ships="filteredShips" />
            </template>
            <template v-else>
                <ship-summary @selected="selected" v-for="(s, index) in filteredShips" :key="s.id" :ship="s" :index="index" :isAdmin="isAdmin" @remove="remove"/>
            </template>
        </div>
        <div v-else class="no-ships">
                No ships currently listed!
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
    props: {
        ships: {
            type: Array,
            default: function () {
                return []
            }
        },
        view: {
            type: String,
            default: 'large'
        },
        showControls: {
            type: Boolean,
            default: true
        },
        showFilter: {
            type: Boolean,
            default: true
        },
        showOwner: {
            type: Boolean,
            default: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: '',
            display: 'large'
        }
    },
    computed: {
        filteredShips() {
            return this.ships.filter(ship => {
                return ship.short_name.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.name.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.make_text.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.model.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.type_text.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.focus_text.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.size_text.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.owner.name.toLowerCase().includes(this.search.toLowerCase()) ||
                    ship.owner.handle.toLowerCase().includes(this.search.toLowerCase())
            })
        }
    },
    methods: {
        show(display) {
            this.display = display
        },
        selected(ship) {
            this.$emit('selected', ship)
        },
        remove(ship) {
            this.$emit('remove', ship)
        }
    },
    mounted() {
        this.display = this.view
        gsap.to(".ships", {duration: 1, opacity: 1})
    }
}
</script>

<style>
    .view-controls {
        margin: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    .no-ships {
        text-align: center;
        font-size: 18px;
        color: #dbf3ff;
    }
    .ships {
        display: flex;
        flex-wrap: wrap;
        opacity: 1;
    }
</style>
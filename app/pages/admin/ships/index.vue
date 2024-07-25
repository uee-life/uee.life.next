<script setup>
const { $api } = useNuxtApp()
const result = ref(null)
const filter = ref('')
const modal = ref({
    show: false,
    add: false
})
const selected = ref(null)

const updateShips = async () => {
    result.value = await $api(`/api/admin/ships/import`)
    .catch((error) => {
        console.error(error)
    })
}

const filteredShips = computed({
    get() {
        return shipModels.value.data.models.filter(model => {
            return model.identifier.toLowerCase().includes(filter.value.toLowerCase()) ||
                    model.manufacturer.toLowerCase().includes(filter.value.toLowerCase()) ||
                    model.model.toLowerCase().includes(filter.value.toLowerCase())
        })
    }
})

const shipImage = (id) => {
    console.log(`ship: ${id}`)
    return `/images/ships/${id}.jpg`
}

const showShipModel = (s) => {
    selected.value = s
    modal.value.show = true
}


const {data: shipModels, status} = await useAPI('/api/ships/models', {
    key: 'getShipModels',
    server: false,
    lazy: true,
})
</script>

<template>
    <div class="main">
        {{  filter }}
        <client-only>
            <teleport to="#left-dock">
                <panel-dock class="actions" title="action">
                    <div class="left-nav-button" @click="modal.add = true">Add Ship Model</div>
                    <div class="left-nav-button" @click="updateShips">
                        Sync with Erkul
                    </div>
                </panel-dock>
                <panel-dock title="Filter ships">
                    <div class="filter">
                        <input class="filter-box" type="text" v-model="filter" placeholder="Filter Ships..." />
                    </div>
                </panel-dock>
            </teleport>
        </client-only>
        <panel
            v-if="status == 'success'" 
            v-for="ship in filteredShips" 
            @click="showShipModel(ship)" class="ship-model">
            <img :src="shipImage(ship.identifier)"  class="ship-image"/>
            <div class="ship-info">
                <div>{{ `${ship.manufacturer} - ${ship.model}` }}</div>
                <div>{{ `${ship.career} - ${ship.role}`}}</div>
                <div>{{ `Cargo: ${ship.cargo}` }}</div>
                <div>{{ `Crew: ${ship.max_crew}` }}</div>
                {{ ship }}
            </div>
        </panel>
        
        <layout-modal v-if="modal.show" title="Ship Model Info" @close = "modal.show = false">
            <ship-summary-model 
                :ship="selected" :is-admin="true"
                @selected="showShipModel(ship)"/>
        </layout-modal>
        <layout-modal v-if="modal.add" title="Add a ship model" @close = "modal.add = false">
            <forms-model-add 
                :data="shipModels.data"
                />
        </layout-modal>
    </div>
</template>

<style scoped>

.main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding-top: 20px;
}

.ship-image {
    width: 150px;
}

.ship-info {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
}

 
</style>
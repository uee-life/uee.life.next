<template>
    <div class="citizen-location">
        <div class="location-row">
            <span class="label">System:</span>
            <!--span v-if="edit.system">
                <select v-model="system">
                    <option disabled value="">Select System</option>
                    <option value="">Not Selected</option>
                    <option v-for="(sys, name) in data.systems" :key="sys.id" :value="{id: sys.id, name: sys.name}">{{ name }}</option>
                </select>
                <img @click="updateSystem" class="edit-button save" title="submit" src="@/assets/tick.png">
                <img @click="edit.system = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
            </span-->
            <span v-if="system">
                <router-link :to="systemLink">{{system.name}}</router-link>
                <img v-if="isOwner && !editing" @click="edit.system = true" class="edit-button edit" src="@/assets/edit.png">
            </span>
            <span v-else>Unknown<img v-if="isOwner && !editing" @click="edit.system = true" class="edit-button edit" src="@/assets/edit.png"></span>
        </div>
        <!--div class="location-row">
            <span class="label">Location:</span>
            <span v-if="edit.location">
                <select v-if="system && hasOptions(data.locations)" v-model="location">
                    <option disabled value="">Select Location</option>
                    <option value="">Not Selected</option>
                    <option v-for="(loc, name) in data.locations" :key="loc.id" :value="{id: loc.id, name: loc.name}">{{ name }}</option>
                </select>
                <img @click="updateLocation" class="edit-button save" title="submit" src="@/assets/tick.png">
                <img @click="edit.location = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
            </span>
            <div v-else-if="location">
                <router-link :to="locationLink">{{location.name}}</router-link>
                <img v-if="isOwner && !editing && hasOptions(data.bases)" @click="edit.location = true" class="edit-button edit" src="@/assets/edit.png">
            </div>
            <div v-else>Unknown<img v-if="isOwner && !editing && hasOptions(data.locations)" @click="edit.location = true" class="edit-button edit" src="~/assets/edit.png"></div>
        </div>
        <div class="location-row">
            <span class="label">Base:</span> 
            <span v-if="edit.base">
                <select v-if="location && hasOptions(data.bases)" v-model="base">
                    <option disabled value="">Select Home Base</option>
                    <option value="">Not Selected</option>
                    <option v-for="loc in data.bases" :key="loc.id" :value="{id: loc.id, name: loc.name}">{{ loc.name }}</option>
                </select>
                <img @click="updateBase" class="edit-button save" title="submit" src="@/assets/tick.png">
                <img @click="edit.base = false" class="edit-button cancel" title="cancel" src="@/assets/delete.png">
            </span>
            <div v-else-if="base">
                <router-link :to="baseLink">{{base.name}}</router-link>
                <img v-if="isOwner && !editing && hasOptions(data.bases)" @click="edit.base = true" class="edit-button edit" src="@/assets/edit.png">
            </div>
            <div v-else>Unknown<img v-if="isOwner && !editing && hasOptions(data.bases)" @click="edit.base = true" class="edit-button edit" src="~/assets/edit.png"></div>
        </div-->
    </div>
</template>

<script setup>
const props = defineProps({
    citizen: {
        type: Object,
        required: true,
    },
    isOwner: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
    .citizen-location {
        display: flex;
        flex-direction: column;
    }
    .location-row {
        display: flex;
        flex-grow: 1;
    }
    .location-row .label {
        width: 70px;
    }
    .citizen-location .labels {
        display: flex;
        flex-direction: column;
        font-family: 'Michroma';
        font-size: 12px;
        text-transform: uppercase;
    }
    .citizen-location .data {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 19.5px;
        margin-left: 10px;
        color: #dbf3ff;
    }
    .line-item {
        display: flex;
        justify-content: space-between;
    }

    .line-item select {
        color: #39ced8;
        background: url('@/assets/fading-bars.png') repeat;
        border: 1px solid #546f84;
        margin: 2px;
    }

    .line-item select option {
        background-color: rgb(13, 46, 66);
    }
</style>
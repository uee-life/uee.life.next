<template>
    <div>
        <panel :class="'notification '+messageType" id="notification" @click="toggleModal">
            {{messageText}}
        </panel>
        <layout-modal :title="messageType" v-if="showModal" @close="toggleModal">
            <div :class="'modal '+messageType">
                <slot />
            </div>
        </layout-modal>
    </div>
</template>

<script setup>
    const props = defineProps({
        messageText: {
            type: String,
            default: "No Message Supplied"
        },
        messageType: {
            type: String,
            required: true,
            validator(value, props) {
                return ['error', 'warning', 'debug', 'information',].includes(value)
            }
        },
        modality: {
            type: Boolean,
            default: false
        }
    })
    const showModal=ref(false)

    function toggleModal(){
        if (props.modality){
            showModal.value = !showModal.value
        }
    }
</script>

<style scoped>
.notification {
    display: flex;
    margin: 10px;
    justify-content: center;
    min-height: 30px;
}

.modal {
    display: flex;
    margin: 10px;
    justify-content: center;
    min-height: 20px;
}

.error {
    background: rgba(255,0,0,0.1);
    color: #dbf3ff;
}

.warning {
    background: rgba(255, 174, 0, 0.623);
    color: #000000;
}

.debug {
    background: rgb(229, 255, 0);
    color: #000000;
}

.info {
    background: rgba(255, 255, 255, 0.555);
    color: #000000;
}

</style>
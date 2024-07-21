<template>
    <div>
        <panel :class="notificationClass" id="notification" @click="toggleModal">
            <img :src="`/images/${messageType}.png`" class="logoImg" />
            {{messageText}}
            <img :src="`/images/${messageType}.png`" class="logoImg right" />
        </panel>
        <layout-modal :title="messageType" v-if="showModal" @close="toggleModal">
            <div class="modal">
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

    const notificationClass = computed({
        get() {
            return `notification ${props.messageType} ${ props.modality ? 'hasModal' : ''}`
        }
    })
</script>

<style scoped>
.notification {
    display: flex;
    margin: 10px;
    justify-content: center;
    min-height: 30px;
    max-width: 100%;
    font: 14px michroma;
    text-shadow: 1px 1px black, -1px 1px black, -1px -1px black, 1px -1px black;
}

.notification.hasModal {
    cursor: pointer;
}

.logoImg {
    position: absolute;
    left: 8px;
    top: 8px;
    height: 25px;
}

.logoImg.right {
    left: auto;
    right: 8px;
}

.modal {
    display: flex;
    margin: 10px;
    justify-content: center;
    min-height: 20px;
    min-width: 150px;
}

.error {
    background: rgba(189, 4, 4, 0.6);
    color: #dbf3ff;
}

.warning {
    background: rgba(255, 240, 0, 0.6); /* repeating-linear-gradient(45deg, rgba(255, 240, 0, 0.6), rgba(255, 240, 0, 0.6) 5px, transparent 5px, transparent 10px);*/
    color: #dbf3ff;
}

.debug {
    background: rgba(9, 160, 100, 0.6);
    color: #dbf3ff;
}

.info {
    background: rgba(7, 122, 253, 0.6);
    color: #dbf3ff;
}

</style>
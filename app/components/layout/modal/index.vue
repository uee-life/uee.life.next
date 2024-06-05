<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <panel-main class="modal-body">
                        <panel-title v-if="title" :text="title" />
                        <input type="button" class="modal-close" @click="$emit('close')" value="X" />
                        <slot>
                            default body
                        </slot>
                    </panel-main>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: ""
    }
})

function close() {
    $emit
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: fit-content;
  margin: 0px auto;
  padding: 20px 30px;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
    background: rgba(13, 46, 66, 0.7);
    width: fit-content;
    padding: 10px;
}

.modal-close {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    cursor: pointer;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
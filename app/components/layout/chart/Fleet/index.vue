<script setup>
import $ from 'jquery'

const props = defineProps({
    datasource: {
        type: Object,
        required: true
    },
    selected: {
        type: String,
        required: false,
        default: ''
    },
    pan: {
      type: Boolean,
      required: false
    },
    zoom: {
      type: Boolean,
      required: false
    },
    zoomoutLimit: {
      type: Number,
      required: false,
      default: 0.5
    },
    zoominLimit: {
      type: Number,
      required: false,
      default: 7
    }
})

const emit = defineEmits(['setSelected'])

const cursorVal = ref('default')
const panning = ref(false)
const startX = ref(0)
const startY = ref(0)
const transformVal = ref('')

const setSelected = (id) => {
  console.log('set selected called')
  emit('setSelected', id)
}

const panHandler = (e) => {
    let newX = 0
    let newY = 0
    if (!e.targetTouches) { // pand on desktop
        newX = e.pageX - startX.value
        newY = e.pageY - startY.value
    } else if (e.targetTouches.length === 1) { // pan on mobile device
        newX = e.targetTouches[0].pageX - startX.value
        newY = e.targetTouches[0].pageY - startY.value
    } else if (e.targetTouches.length > 1) {
        return;
    }
    if (transformVal.value === '') {
        if (transformVal.value.indexOf('3d') === -1) {
            transformVal.value = 'matrix(1,0,0,1,' + newX + ',' + newY + ')'
        } else {
            transformVal.value = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + newX + ', ' + newY + ',0,1)'
        }
    } else {
        let matrix = transformVal.value.split(',')
        if (transformVal.value.indexOf('3d') === -1) {
        matrix[4] = newX
        matrix[5] = newY + ')'
        } else {
        matrix[12] = newX
        matrix[13] = newY
        }
        transformVal.value = matrix.join(',')
    }
}

const panStartHandler = (e) => {
    if ($(e.target).closest('.node').length) {
    panning.value = false
    return
    } else {
    cursorVal.value = 'move'
    panning.value = true
    }
    let lastX = 0
    let lastY = 0
    if (transformVal.value !== '') {
    let matrix = transformVal.value.split(',')
    if (transformVal.value.indexOf('3d') === -1) {
        lastX = parseInt(matrix[4])
        lastY = parseInt(matrix[5])
    } else {
        lastX = parseInt(matrix[12])
        lastY = parseInt(matrix[13])
    }
    }
    if (!e.targetTouches) { // pand on desktop
    startX.value = e.pageX - lastX
    startY.value = e.pageY - lastY
    } else if (e.targetTouches.length === 1) { // pan on mobile device
    startX.value = e.targetTouches[0].pageX - lastX
    startY.value = e.targetTouches[0].pageY - lastY
    } else if (e.targetTouches.length > 1) {
    return
    }
}

const panEndHandler = () => {
    panning.value = false
    cursorVal.value = 'default'
}

const setChartScale = (newScale) => {
      let matrix = ''
      let targetScale = 1
      if (transformVal.value === '') {
        transformVal.value = 'matrix(' + newScale + ', 0, 0, ' + newScale + ', 0, 0)'
      } else {
        matrix = transformVal.value.split(',')
        if (transformVal.value.indexOf('3d') === -1) {
          targetScale = Math.abs(window.parseFloat(matrix[3]) * newScale)
          if (targetScale > zoomoutLimit.value && targetScale < this.zoominLimit) {
            matrix[0] = 'matrix(' + targetScale
            matrix[3] = targetScale
            transformVal.value = matrix.join(',')
          }
        } else {
          targetScale = Math.abs(window.parseFloat(matrix[5]) * newScale)
          if (targetScale > zoomoutLimit.value && targetScale < zoominLimit.value) {
            matrix[0] = 'matrix3d(' + targetScale
            matrix[5] = targetScale
            transformVal.value = matrix.join(',')
          }
        }
      }
    }
</script>

<template>
    <div v-bind="{ slots: $slots }"
        class="chart-container"
        @wheel="zoom && zoomHandler($event)"
        @mouseup="pan && panning && panEndHandler($event)">
        <div class="orgchart"
            :style="{ transform: transformVal, cursor: cursorVal}"
            @mousedown="pan && panStartHandler($event)"
            @mousemove="pan && panning && panHandler($event)">
            <layout-chart-fleet-node 
                :datasource="datasource"
                :selected="selected"
                @setSelected = "setSelected">
                <template v-for="slot in Object.keys($slots)" :slot="slot" slot-scope="scope">
                    <slot :name="slot" v-bind="scope"></slot>
                </template>
            </layout-chart-fleet-node>
        </div>
    </div>
</template>

<style scoped>
.chart-container {
    position: relative;
    display: inline-block;
    height: fit-content;
    width: 100%;
    border-radius: 5px;
    overflow: auto;
    text-align: center;
}

.orgchart {
    box-sizing: border-box;
    display: inline-block;
    min-height: 202px;
    min-width: 202px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 20px;
}

.orgchart .hidden,
.orgchart ~ .hidden {
  display: none;
}
.orgchart.b2t {
  transform: rotate(180deg);
}
.orgchart.l2r {
  position: absolute;
  transform: rotate(-90deg) rotateY(180deg);
  transform-origin: left top;
}
.orgchart .verticalNodes ul {
  list-style: none;
  margin: 0;
  padding-left: 18px;
  text-align: left;
}
.orgchart .verticalNodes ul:first-child {
  margin-top: 2px;
}
.orgchart .verticalNodes > td::before {
  content: "";
  border: 1px solid rgba(13, 46, 66, 0.8);
}
.orgchart .verticalNodes > td > ul > li:first-child::before {
  box-sizing: border-box;
  top: -4px;
  height: 30px;
  width: calc(50% - 2px);
  border-width: 2px 0 0 2px;
}
.orgchart .verticalNodes ul > li {
  position: relative;
}
.orgchart .verticalNodes ul > li::before,
.orgchart .verticalNodes ul > li::after {
  box-sizing: border-box;
  content: "";
  position: absolute;
  left: -6px;
  border-color: rgba(13, 46, 66, 0.8);
  border-style: solid;
  border-width: 0 0 2px 2px;
}
.orgchart .verticalNodes ul > li::before {
  top: -4px;
  height: 30px;
  width: 11px;
}
.orgchart .verticalNodes ul > li::after {
  top: 1px;
  height: 100%;
}
.orgchart .verticalNodes ul > li:first-child::after {
  box-sizing: border-box;
  top: 24px;
  width: 11px;
  border-width: 2px 0 0 2px;
}
.orgchart .verticalNodes ul > li:last-child::after {
  box-sizing: border-box;
  border-width: 2px 0 0;
}
.orgchart.r2l {
  position: absolute;
  transform: rotate(90deg);
  transform-origin: left top;
}
.orgchart > .spinner {
  font-size: 100px;
  margin-top: 30px;
  color: rgba(68, 157, 68, 0.8);
}

</style>
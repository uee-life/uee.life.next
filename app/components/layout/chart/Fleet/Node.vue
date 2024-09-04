<script setup>
const props = defineProps({
    datasource: {
        type: Object,
        required: true
    },
    selected: {
        type: String,
        default: ''
    }
})

console.log('node component for: ' + props.datasource.info.id)
console.log(props.datasource.groups)

const emit = defineEmits(['setSelected'])

const nodeClass = computed({
    get () {
        if(props.datasource.info.id == props.selected) {
            return "node selected"
        }
        return "node"
    }
})

const setSelected = (id) => {
  console.log('click!')
  console.log(id)
  emit('setSelected', id)
}
</script>

<template>
    <table>
        <tbody>
        <tr>
        <td :colspan="datasource.groups && datasource.groups.length ? datasource.groups.length*2 : null">
            <div :class="nodeClass" :id="datasource.info.id" @click.stop="setSelected(datasource.info.id)">
              <slot :node-data="datasource">
                  <div class="title">
                    {{ datasource.info.name }}
                  </div>
                  <div class="content">{{ datasource.info.purpose }}</div>
                  <citizen-portrait v-if="datasource.cmdr" :citizen="datasource.cmdr" size="tiny" shape="round" class="node-cmdr"/>
                  <div v-else class="node-no-cmdr"></div>
              </slot>
            </div>
        </td>
        </tr>
        <template v-if="datasource.groups && datasource.groups.length">
            <tr class="lines">
            <td :colspan="datasource.groups.length*2">
                <div class="downLine"></div>
            </td>
            </tr>
            <tr class="lines">
            <td class="rightLine"></td>
            <template v-for="n in (datasource.groups.length-1)">
                <td class="leftLine topLine"></td>
                <td class="rightLine topLine"></td>
            </template>
            <td class="leftLine"></td>
            </tr>
            <tr class="nodes">
            <td colspan="2" v-for="group in datasource.groups" :key="group.id">
                <layout-chart-fleet-node :datasource="group" @setSelected="setSelected" :selected="selected">
                <template v-for="slot in Object.keys($slots)" :slot="slot" slot-scope="scope">
                    <slot :name="slot" ></slot>
                </template>
                </layout-chart-fleet-node>
            </td>
            </tr>
        </template>
        </tbody>
    </table>
</template>

<style scoped>
.orgchart .node-cmdr {
  position: absolute !important;
  left: -47px;
  top: 0px;
  overflow: hidden;
}

.orgchart .node-no-cmdr {
  position: absolute !important;
  left: -47px;
  top: 2px;
  border: 1px dashed rgb(219, 243, 255);
  border-radius: 20px;
  overflow: hidden;
  width: 38px;
  height: 38px;
}

.orgchart .node {
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  margin: 0 30px;
  border: 2px dashed transparent;
  border-radius: 6px;
  text-align: center;
  width: 150px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
  transition: all 200ms ease-out;
}

.orgchart .node .delete {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 18px;
        height: 18px;
        cursor: pointer;
}

.orgchart .node.selected {
  background-color: rgba(219, 243, 255, 0.45) !important;
  box-shadow: 0 0 16px rgba(219, 243, 255, 1) !important;
}

.orgchart .node > .spinner {
  position: absolute;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
  vertical-align: middle;
  font-size: 30px;
  color: rgba(68, 157, 68, 0.8);
}
.orgchart .node:hover {
  background-color: rgba(57, 206, 216, 0.45);
  box-shadow: 0 0 16px rgba(57, 206, 216, 1);
  transition: 0.5s;
  cursor: pointer;
  z-index: 20;
}
.orgchart .node.focused {
  background-color: rgba(238, 217, 54, 0.5);
}
.orgchart .ghost-node {
  position: fixed;
  left: -10000px;
  top: -10000px;
}
.orgchart .ghost-node rect {
  fill: #ffffff;
  stroke: #bf0000;
}
.orgchart .node.allowedDrop {
  border-color: rgba(68, 157, 68, 0.9);
}
.orgchart .node .title {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: rgba(13, 46, 66, 0.8);
  color: #fff;
  border-radius: 4px 4px 0 0;
}

.orgchart .node .title .symbol {
  float: left;
  margin-top: 4px;
  margin-left: 2px;
}
.orgchart .node .content {
  box-sizing: border-box;
  width: 100%;
  height: 20px;
  font-size: 11px;
  line-height: 18px;
  border: 1px solid rgba(13, 46, 66, 0.8);
  border-radius: 0 0 4px 4px;
  text-align: center;
  background-color: #fff;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.orgchart .node .edge {
  font-size: 15px;
  position: absolute;
  color: rgba(68, 157, 68, 0.5);
  cursor: default;
  transition: 0.2s;
}
.orgchart.noncollapsable .node .edge {
  display: none;
}
.orgchart .edge:hover {
  color: #449d44;
  cursor: pointer;
}
.orgchart .node .verticalEdge {
  width: calc(100% - 10px);
  width: -webkit-calc(100% - 10px);
  width: -moz-calc(100% - 10px);
  left: 5px;
}
.orgchart .node .topEdge {
  top: -4px;
}
.orgchart .node .bottomEdge {
  bottom: -4px;
}
.orgchart .node .horizontalEdge {
  width: 15px;
  height: calc(100% - 10px);
  height: -webkit-calc(100% - 10px);
  height: -moz-calc(100% - 10px);
  top: 5px;
}
.orgchart .node .rightEdge {
  right: -4px;
}
.orgchart .node .leftEdge {
  left: -4px;
}
.orgchart .node .horizontalEdge::before {
  position: absolute;
  top: calc(50% - 7px);
}
.orgchart .node .rightEdge::before {
  right: 3px;
}
.orgchart .node .leftEdge::before {
  left: 3px;
}
.orgchart .node .toggleBtn {
  position: absolute;
  left: 5px;
  bottom: -2px;
  color: rgba(68, 157, 68, 0.6);
}
.orgchart .node .toggleBtn:hover {
  color: rgba(68, 157, 68, 0.8);
}
.oc-export-btn {
  display: inline-block;
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  color: #fff;
  background-color: #5cb85c;
  border: 1px solid transparent;
  border-color: #4cae4c;
  border-radius: 4px;
}
.oc-export-btn[disabled] {
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.3;
}
.oc-export-btn:hover,
.oc-export-btn:focus,
.oc-export-btn:active {
  background-color: #449d44;
  border-color: #347a34;
}
.orgchart ~ .mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
}
.orgchart ~ .mask .spinner {
  position: absolute;
  top: calc(50% - 54px);
  left: calc(50% - 54px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 108px;
}
.orgchart .node {
  transition: transform 0.3s, opacity 0.3s;
}
.orgchart .slide-down {
  opacity: 0;
  transform: translateY(40px);
}

.orgchart .slide-up {
  opacity: 0;
  transform: translateY(-40px);
}

.orgchart .slide-right {
  opacity: 0;
  transform: translateX(130px);
}

.orgchart .slide-left {
  opacity: 0;
  transform: translateX(-130px);
}
.orgchart table {
  border-spacing: 0;
  border-collapse: separate;
}
.orgchart > table:first-child {
  margin: 20px auto;
}
.orgchart td {
  text-align: center;
  vertical-align: top;
  padding: 0;
}
.orgchart .lines:nth-child(3) td {
  box-sizing: border-box;
  height: 20px;
}
.orgchart .lines .topLine {
  border-top: 2px solid rgba(84, 111, 132, 0.8);
}
.orgchart .lines .rightLine {
  border-right: 1px solid rgba(84, 111, 132, 0.8);
  float: none;
  border-radius: 0;
}
.orgchart .lines .leftLine {
  border-left: 1px solid rgba(84, 111, 132, 0.8);
  float: none;
  border-radius: 0;
}
.orgchart .lines .downLine {
  background-color: rgba(84, 111, 132, 0.8);
  margin: 0 auto;
  height: 20px;
  width: 2px;
  float: none;
}
</style>
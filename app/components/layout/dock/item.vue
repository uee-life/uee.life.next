<template>
    <div :class="divClass">
        <layout-section-title v-if="title" :text="title" />
        <div :id="type" :class="type"></div>
        <span class="corner top left"></span>
        <span class="corner top right"></span>
        <span class="corner bottom left"></span>
        <span class="corner bottom right"></span>
    </div>
</template>

<script>

export default {
    name: 'dock-item',
    props: {
        title: {
            type: String,
            default: ""
        },
        type: {
            type: String
        }
    },
    computed: {
        divClass() {
            /*if (this.isMobile) {
                return 'dock-item mobile'
            } else {*/
                return 'dock-item'
            //}
        }
    }
}
</script>

<style>
    .dock-item {
        position: relative;
        box-sizing: border-box;
        height: fit-content;
        width: 240px;
        min-width: 240px;
        margin: 10px;
        margin-top: 20px;
        padding: 15px 10px;
        background: url('/images/fading-bars.png') repeat;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
    .dock-item.mobile {
        width: calc(100% - 5px)
    }
</style>
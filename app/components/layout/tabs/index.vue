<template>
    <div class="tabs">
        <header class="tab-header">
            <ul class="tab-titles">
                <li
                    class="tab-title"
                    v-for="tab in tabs"
                    :key="tab"
                    :class="{'tab-title-active': activeTab === tab}"
                    v-on:click="switchTab(tab);">
                    <slot :name="tabTitleSlotName(tab)">
                        {{ tab }}
                    </slot>
                </li>
            </ul>
        </header>
        <main class="tab-body">
            <div class="tab-panel">
                <slot :name="tabPanelSlotName"></slot>
            </div>
        </main>
    </div>
</template>

<script setup>
const props = defineProps({
    tabs: {
        type: Object
    },
    initialTab: {
        type: String,
        default: 'ships'
    }
});

const activeTab = ref(props.initialTab);

const tabPanelSlotName = computed({
    get() {
        return `tab-content-${activeTab.value}`
    }
});

function tabTitleSlotName(tabName) {
    return `tab-title-${tabName}`
};

function switchTab(tabName) {
    activeTab.value = tabName
};
</script>

<style>
.tab-titles {
    margin-bottom: 10px;
}

.tab-title {
    display: inline-block;
    margin: 0 5px;
    font-size: calc(12px + 4 * ((100vw - 300px) / 4000));
    font-family: 'Michroma';
    letter-spacing: 0.8px;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
}

.tab-title:hover {
    border-bottom: 2px solid #39ced8;
}

.tab-title-active {
    border-bottom: 2px solid #39ced8;
}
</style>
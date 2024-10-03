<template>
    <div class="pagination">
        <layout-pagination-button
            :disabled="isPreviousButtonDisabled"
            @click.native="prevPage"
            >
            <img class="arrow" src="@/assets/arrow-left.png" />
        </layout-pagination-button>
        <span v-if="hiddenBefore">
        <layout-pagination-number
            v-if="hiddenBefore"
            :pageNumber="1"
            :currentPage="currentPage"
            @loadPage="onLoadPage"/>
            ...
        </span>
        <layout-pagination-number
            v-for="page in pages"
            :key="page"
            :pageNumber="page"
            :currentPage="currentPage"
            @loadPage="onLoadPage"
            />
        
        <span v-if="hiddenAfter">    
            ...
        <layout-pagination-number
            v-if="hiddenAfter"
            :pageNumber="pageCount"
            :currentPage="currentPage"
            @loadPage="onLoadPage"/>
        </span>
        <layout-pagination-button
            :disabled="isNextButtonDisabled"
            @click.native="nextPage"
            >
            <img class="arrow" src="@/assets/arrow-right.png" />
        </layout-pagination-button>
    </div>
</template>

<script setup>
const emit = defineEmits(['loadPage', 'nextPage', 'prevPage'])
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    }
})

const maxPageNums = ref(8)


const isPreviousButtonDisabled = computed({
    get() {
        return props.currentPage === 1
    }
})

const isNextButtonDisabled = computed({
    get() {
        return props.currentPage === props.pageCount
    }
})

const hiddenBefore = computed({
    get() {
        return props.currentPage >= maxPageNums.value / 2
    }
})

const hiddenAfter = computed({
    get() {
        return props.currentPage <= props.pageCount - (maxPageNums.value / 2) + 1
    }
})

const pages = computed({
    get() {
        // eslint-disable-next-line
        let end = props.pageCount
        let offset = 1
        if(props.pageCount > maxPageNums.value) {
            end = maxPageNums.value - 3
            if(props.currentPage < (maxPageNums.value / 2)) {
                //
            } else {
                offset = props.currentPage - (maxPageNums.value / 2) + 2
                if(offset > props.pageCount - (maxPageNums.value / 2)) {
                    offset = props.pageCount - (maxPageNums.value / 2)
                }
            }
        }
        return Array.from([...Array(end).keys()].map(x => x + offset));
    }
})

function nextPage() {
    emit('nextPage')
}
function onLoadPage(value) {
    emit('loadPage', value)
}
function prevPage() {
    emit('prevPage')
}
</script>

<style>
    .pagination {
        display: flex;
        justify-content: center;
    }
    .arrow {
        width: 20px;
        padding-top: 2px;
    }
</style>
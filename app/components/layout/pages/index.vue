<template>
    <div class="pagination">
        <layout-pages-button
            :disabled="isPreviousButtonDisabled"
            @click.native="prevPage"
            >
            ←
        </layout-pages-button>
        <span v-if="hiddenBefore">
        <layout-pages-number
            v-if="hiddenBefore"
            :pageNumber="1"
            :currentPage="currentPage"
            @loadPage="onLoadPage"/>
            ...
        </span>
        <layout-pages-number
            v-for="page in pages"
            :key="page"
            :pageNumber="page"
            :currentPage="currentPage"
            @loadPage="onLoadPage"
            />
        
        <span v-if="hiddenAfter">    
            ...
        <layout-pages-number
            v-if="hiddenAfter"
            :pageNumber="pageCount"
            :currentPage="currentPage"
            @loadPage="onLoadPage"/>
        </span>
        <layout-pages-button
            :disabled="isNextButtonDisabled"
            @click.native="nextPage"
            >
            →
        </layout-pages-button>
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

/*export default {
    name: "pagination",
    props: {
        currentPage: {
            type: Number,
            required: true
        }, 
        pageCount: {
            type: Number,
            required: true
        }
    },
    components: {
        PageButton,
        PageNumber
    },
    data() {
        return {
            maxPageNums: 8
        }
    },
    methods: {
        nextPage() {
            this.$emit('nextPage')
        },
        onLoadPage(value) {
            this.$emit('loadPage', value)
        },
        prevPage() {
            this.$emit('prevPage')
        }
    },
    computed: {
        isPreviousButtonDisabled() {
            return this.currentPage === 1
        },
        isNextButtonDisabled() {
            return this.currentPage === this.pageCount
        },
        hiddenBefore() {
            return this.currentPage >= this.maxPageNums / 2
        },
        hiddenAfter() {
            return this.currentPage <= this.pageCount - (this.maxPageNums / 2) + 1
        },
        pages() {
            // eslint-disable-next-line
            console.log(this.pageCount)
            let end = this.pageCount
            let offset = 1
            if(this.pageCount > this.maxPageNums) {
                end = this.maxPageNums - 3
                if(this.currentPage < (this.maxPageNums / 2)) {
                    //
                } else {
                    offset = this.currentPage - (this.maxPageNums / 2) + 2
                    if(offset > this.pageCount - (this.maxPageNums / 2)) {
                        offset = this.pageCount - (this.maxPageNums / 2)
                    }
                }
            }
            return Array.from([...Array(end).keys()].map(x => x + offset));
        }
    }
}*/
</script>

<style>
    .pagination {
        display: flex;
        justify-content: center;
    }
</style>
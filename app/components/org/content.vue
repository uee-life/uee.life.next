<template>
    <panel :title="title" :centered="centered" :title-size="title.length > 0 ? 'small' : 'no-title'">
        <markdown :markdown="content" :class="contentClass"/>
    </panel>
</template>

<script setup>
const {parseMarkdown} = useMarkdown()

const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        required: true
    },
    centered: {
        type: Boolean,
        default: false
    }
})

const renderedContent = ref({})

const contentClass = computed({
    get() {
        if (props.centered) {
            return "org-content centered"
        } else {
            return "org-content"
        }
    }
})

const loadMarkdown = async () => {
    renderedContent.value = await parseMarkdown(props.content)
}
loadMarkdown()
</script>

<style>
.org-content.centered {
    text-align: center;
}
</style>
<template>
    <ContentRendererMarkdown :value="markdown" v-if="markdown" />
</template>

<script setup>
const { parseMarkdown } = useMarkdown();

const props = defineProps({
    markdown: {
        type: String,
        default: ""
    },
    file: {
        type: String,
        default: ""
    }
})

const markdown = ref("")

const loadMarkdown = async () => {
  let data = null
  if (props.file) {
    data = await $fetch('/content/' + props.file)
  } else {
    data = props.markdown
  }
  markdown.value = await parseMarkdown(data)
}

loadMarkdown()

</script>
  
<style scoped>
strong {
    color: #dbf3ff;
}
</style>
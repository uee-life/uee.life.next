<template>
    <ContentRendererMarkdown :value="markdown" v-if="markdown" />
</template>

<script setup>
const { $api } = useNuxtApp()
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
    data = await $api('https://static.uee.life/content/' + props.file)
  } else {
    data = props.markdown
  }

  console.log(data)

  markdown.value = await parseMarkdown(data)
}

loadMarkdown()

</script>
  
<style scoped>
strong {
    color: #dbf3ff;
}
</style>
<template>
      <h2 class="about"><ContentSlot unwrap="p"/></h2>
</template>
  
<script setup>
const props = defineProps({
    content: {
        type: String,
        required: true
    }
})

console.log(props.content)
const {data} = await useAsyncData('about', () => queryContent('/about').findOne())
</script>
  
  <style scoped>
      .content {
          position: relative;
          display: flex;
          flex-direction: column;
          text-overflow: ellipsis;
          padding: 0 15px;
      }
  
      .title {
          margin-top: 15px;
          margin-bottom: 20px;
      }
  
      .title h1 {
          margin: 0px;
          font-size: calc(20px + (24 - 20) * ((100vw - 300px) / (1600 - 300)));
          line-height: calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1600 - 300)));
      }
  
      .title .date {
          font-size: 12px;
      }
  
      .edit {
        position: absolute;
        top: 10px;
        right: 10px;
      }
  
      .edit-form {
        display: flex;
        flex-direction: column;
        margin: 20px;
      }
  
      .edit-form .titleInput {
        width: 100%;
      }
  
      .edit-form .contentInput {
        height: 400px;
      }
  </style>
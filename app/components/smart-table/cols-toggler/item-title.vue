<template>
  <div>
    <label v-if="item.title">
      <input type="checkbox">
      <span v-html="formattedTitle(item.title)"></span>
    </label>
  </div>
</template>

<script>
  export default {
    name: "cols-toggler-item-title",
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<style scoped>

</style>
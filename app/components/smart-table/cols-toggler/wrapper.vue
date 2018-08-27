<template>
  <div>
    <div v-for="item in visibleItems">
      <cols-toggler-item :item="item"></cols-toggler-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: "cols-toggler-wrapper",
    props: {
      items: {
        type: Array,
        required: true,
      },
    },
    computed: {
      visibleItems() { return this.items.filter(i => (!i.hidden || i.edit)) },
    },
  }
</script>

<style scoped>

</style>
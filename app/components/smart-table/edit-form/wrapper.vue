<template>

  <div class="form-group">
    <p v-html="formattedTitle(node.title)"></p>
    <div class="form-indent">
      <edit-form-fields :nodes="node.children" :parent="nodeId(node)"></edit-form-fields>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'form-wrapper',
    props: {
      node: {
        type: Object,
        required: true,
      },
      parent: {
        type: String,
        default: '',
      },
    },
    methods: {
      nodeHasChildren(node) { return node.children && node.children.length },
      nodeId(node) { return (this.parent ? this.parent + '.' : '') + node.id },
    },
  }
</script>

<style scoped>

</style>
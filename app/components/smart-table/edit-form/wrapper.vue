<template>
  <div>
    <div class="form-group" v-if="node.title">
      <p v-html="formattedTitle(node.title)"></p>
      <div class="form-indent">
        <edit-form-fields :nodes="node.children"></edit-form-fields>
      </div>
    </div>
    <edit-form-fields :nodes="node.children" v-else></edit-form-fields>
  </div>
</template>

<script>

  export default {
    name: 'edit-form-wrapper',
    props: {
      node: {
        type: Object,
        required: true,
      },
    },
    methods: {
    },
  }
</script>

<style scoped>

</style>
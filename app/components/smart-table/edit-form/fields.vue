<template>
    <div>
        <template v-for="node in visibleNodes">
            <template v-if="nodeHasChildren(node)">
                <edit-form-wrapper :node="node"></edit-form-wrapper>
            </template>
            <template v-else>
                <edit-form-item :node="node"></edit-form-item>
            </template>
        </template>
    </div>
</template>

<script>
  import Item from '~components/smart-table/edit-form/item';

  export default {
    name: 'edit-form-fields',
    components: {
      'edit-form-item': Item,
    },
    props: {
      nodes: {
        type: Array,
        required: true,
      },
    },
    computed: {
      visibleNodes() { return this.nodes.filter(n => (n.edit)) }
    },
    methods: {
      nodeHasChildren(node) { return node.children && node.children.length },
    }
  }
</script>

<style scoped>

</style>
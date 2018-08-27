<template>
  <div>
    <template v-if="nodeHasChildren(item)">
      <div v-if="item.title">
        <item-title :item="item" />
        <div class="form-indent">
          <cols-toggler-wrapper :items="item.children"></cols-toggler-wrapper>
        </div>
      </div>
      <template v-else>
        <cols-toggler-wrapper :items="item.children"></cols-toggler-wrapper>
      </template>
    </template>
    <template v-else>
      <item-title :item="item" />
    </template>
  </div>
</template>

<script>
  import ItemTitle from '~components/smart-table/cols-toggler/item-title';

  export default {
    name: "cols-toggler-item",
    components: {
      'item-title': ItemTitle,
    },
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    methods: {
      nodeHasChildren(node) { return node.children && node.children.length },
    },
  }
</script>

<style scoped>

</style>
<template>
  <div>
    <template v-for="node in visibleNodes">
      <template v-if="nodeHasChildren(node)">
        <edit-form-wrapper :node="node" :parent="parent"></edit-form-wrapper>
      </template>
      <template v-else>
        <template v-if="node.type === 'color'">
          <mdl-textfield
              :floating-label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: nodeId(node)})"
              type="color"
              class="mdl-textfield--full-width"
          ></mdl-textfield>
        </template>
        <template v-else-if="node.type === 'select'">
          <mdl-select
              :id="nodeId(node)"
              :label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: nodeId(node)})"
              :options="getInObj(info, nodeId(node))"
              class="mdl-textfield--full-width"
          ></mdl-select>
        </template>
        <template v-else-if="node.type === 'autocomplete'">
          <mdl-autocomplete
              :id="nodeId(node)"
              :label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: nodeId(node)})"
              :options="getInObj(info, nodeId(node))"
              :strict="node.strict"
              class="mdl-textfield--full-width"
          ></mdl-autocomplete>
        </template>
        <template v-else>
          <mdl-textfield
              :readonly="!!node.readonly"
              :floating-label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: nodeId(node)})"
              :type="node.type"
              class="mdl-textfield--full-width"
          ></mdl-textfield>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    name: 'form-fields',
    props: {
      nodes: {
        type: Array,
        required: true,
      },
      parent: {
        type: String,
        default: '',
      },
    },
    data() {
      return {}
    },
    computed: {
      ...mapState('table', ['info']),
      ...mapState('table/edit', ['editRow', 'editModal']),
      ...mapGetters('table', ['lastOfGrid']),
      visibleNodes() { return this.nodes.filter(n => (!n.hidden || n.edit)) }
    },
    methods: {
      nodeHasChildren(node) { return node.children && node.children.length },
      nodeId(node) { return (this.parent ? this.parent + '.' : '') + node.id },
    }
  }
</script>

<style scoped>

</style>
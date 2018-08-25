<template>
  <div>
    <template v-for="node in visibleNodes">
      <template v-if="nodeHasChildren(node)">
        <edit-form-wrapper :node="node"></edit-form-wrapper>
      </template>
      <template v-else>
        <template v-if="node.type === 'color'">
          <mdl-textfield
              :floating-label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: node.fullId})"
              type="color"
              class="mdl-textfield--full-width"
          ></mdl-textfield>
        </template>
        <template v-else-if="node.type === 'select'">
          <mdl-select
              :id="node.fullId"
              :label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: node.fullId})"
              :options="getInObj(info, node.fullId)"
              class="mdl-textfield--full-width"
          ></mdl-select>
        </template>
        <template v-else-if="node.type === 'autocomplete'">
          <mdl-autocomplete
              :id="node.fullId"
              :label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: node.fullId})"
              :options="getInObj(info, node.fullId)"
              :strict="node.strict"
              class="mdl-textfield--full-width"
          ></mdl-autocomplete>
        </template>
        <template v-else>
          <mdl-textfield
              :readonly="!!node.readonly"
              :floating-label="formattedTitle(node.title)"
              :value="getValue({row: editRow, cols: lastOfGrid, path: node.fullId})"
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
    }
  }
</script>

<style scoped>

</style>
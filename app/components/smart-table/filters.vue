<template>
    <tr>
        <th v-if="controls.checks"></th>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit + controls.remove"></th>
        <th></th>
        <th v-for="(cell,i) in lastOfGrid" :colspan="cell.colspan" v-show="!cell.hidden" scope="col" :data-tablesaw-priority="!cell.hidden ? 1 : false" :data-sort="cell.id" :width="cell.width?cell.width:false" :data-type="cell.sortType?cell.sortType:false">
            <filter-input :cellId="cell.id" :type="cell.filterType || 'text'"></filter-input>
        </th>
        <template v-if="controls.dates">
            <th><filter-input cellId="createdAt" type="date"></filter-input></th>
            <th><filter-input cellId="updatedAt" type="date"></filter-input></th>
        </template>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit + controls.remove"></th>

    </tr>
</template>

<script>
  import FilterInput from '~components/smart-table/filter-input'
  import {mapGetters, mapState} from 'vuex';

  export default {
    name: "filters",
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['editModal']),
      ...mapGetters('table', ['sortBy', 'sortDirection', 'limit', 'controls', 'lastOfGrid', 'grid', 'checkedAll']),
    },
    components: {
      'filter-input': FilterInput,
    },
  }
</script>

<style scoped>

</style>
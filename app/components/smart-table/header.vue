<template>
    <thead>
    <tr v-for="(row,j) in topGrid" :key="j" data-tablesaw-ignorerow="" class="center-all">
        <th v-for="(cell,i) in visibleSecondCols(row)" :key="cell.id" :colspan="cell.colspan" v-html="cell.title"></th>
    </tr>
    <tr class="center-all wide-all">
        <th v-if="controls.checks" class="mdl-th-padding text-center" width="67px">
            <mdl-checkbox id="checkAll" :value="checkedAll" @change.native="toggleCheckAll" :disabled="editModal"></mdl-checkbox>
        </th>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit+controls.remove" class="text-center" :width="(controls.edit*43+controls.remove*43)+'px'">Действия</th>
        <th scope="col" class="text-center" width="50px">№</th>
        <th v-for="(cell,i) in visibleCols" :key="cell.id" :colspan="cell.colspan" scope="col" :data-sort="cell.id" :width="cell.width?cell.width:false" :data-type="cell.sortType?cell.sortType:false">
            <span v-html="cell.title"></span>
            <filter-icon :cellId="cell.id" @show-filter="$emit('show-filter', cell.id, $event)"/>
        </th>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit+controls.remove" class="text-center" :width="(controls.edit*43+controls.remove*43)+'px'">Действия</th>
    </tr>
    </thead>
</template>

<script>
  import FilterIcon from '~components/smart-table/filter/icon'
  import {mapActions, mapGetters, mapState} from 'vuex';

  export default {
    components: {
      'filter-icon': FilterIcon,
    },
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table/edit', ['editModal']),
      ...mapGetters('table', ['sortBy', 'sortDirection', 'limit', 'controls', 'checkedAll']),
      ...mapGetters('table/structure', ['lastOfGrid', 'grid']),
      visibleCols() {
        return this.lastOfGrid.filter(cell => (cell.id && cell.colspan && !cell.hidden));
      },
      visibleSecondCols() {
        return (row) => row.filter(cell => (cell.colspan && !cell.hidden));
      },
      topGrid() {
        let lengthGrid = this.grid.length;
        return this.grid.filter((row, i) => i < lengthGrid - 1);
      }
    },
    methods: {
      ...mapActions('table', ['toggleCheckAll']),
    },
  }
</script>

<style scoped>

</style>
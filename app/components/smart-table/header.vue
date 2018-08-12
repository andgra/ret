<template>
    <thead>
    <tr v-for="(row,j) in topGrid" :key="j" data-tablesaw-ignorerow="" class="center-all">
        <th v-for="(cell,i) in visibleRow(row)" :key="cell.id" :colspan="cell.colspan">{{cell.title}}</th>
    </tr>
    <tr class="center-all wide-all">
        <th v-if="controls.checks" class="mdl-th-padding text-center" width="67px">
            <mdl-checkbox id="checkAll" :value="checkedAll" @change.native="toggleCheckAll" :disabled="editModal"></mdl-checkbox>
        </th>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit+controls.remove" class="text-center" :width="(controls.edit*43+controls.remove*43)+'px'">Действия</th>
        <th scope="col" class="text-center" width="50px">№</th>
        <th v-for="(cell,i) in visibleCols" :key="cell.id" :colspan="cell.colspan" scope="col" :data-tablesaw-priority="!cell.hidden ? 1 : false" :data-sort="cell.id" :width="cell.width?cell.width:false" :data-type="cell.sortType?cell.sortType:false">
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
    name: "header",
    components: {
      'filter-icon': FilterIcon,
    },
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['editModal']),
      ...mapGetters('table', ['sortBy', 'sortDirection', 'limit', 'controls', 'lastOfGrid', 'grid', 'checkedAll']),
      datesGrid() {
        return [
          {
            id: 'createdAt',
            title: 'Создан',
            colspan: 1,
            sortType: 'date',
          },
          {
            id: 'updatedAt',
            title: 'Изменен',
            colspan: 1,
            sortType: 'date',
          },
        ]
      },
      cols() {
        let cols = this.lastOfGrid;
        if (this.controls.dates) {
          cols = [...cols, ...this.datesGrid]
        }
        return cols;
      },
      visibleCols() {
        return this.cols.filter(cell => (cell.id && cell.colspan && !cell.hidden));
      },
      visibleRow() {
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
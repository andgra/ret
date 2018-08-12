<template>
    <thead>
    <tr v-for="(row,j) in grid" v-if="j<grid.length-1" data-tablesaw-ignorerow="" class="center-all">
        <th v-for="(cell,i) in row" :colspan="cell.colspan" v-show="cell.colspan && !cell.hidden">{{cell.title}}</th>
    </tr>
    <tr class="center-all wide-all">
        <th v-if="controls.checks" class="mdl-th-padding text-center" width="67px">
            <mdl-checkbox id="checkAll" :value="checkedAll" @change.native="toggleCheckAll" :disabled="editModal"></mdl-checkbox>
        </th>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit+controls.remove" class="text-center" :width="(controls.edit*43+controls.remove*43)+'px'">Действия</th>
        <th scope="col" class="text-center" width="50px">№</th>
        <th v-for="(cell,i) in cols" :colspan="cell.colspan" v-show="!cell.hidden" scope="col" :data-tablesaw-priority="!cell.hidden ? 1 : false" :data-sort="cell.id" :width="cell.width?cell.width:false" :data-type="cell.sortType?cell.sortType:false">
            <span v-html="cell.title"></span>
            <filter-icon :cellId="cell.id" @show-filter="$emit('show-filter', cell.id, $event)"></filter-icon>
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
    },
    methods: {
      ...mapActions('table', ['toggleCheckAll']),
    },
    components: {
      'filter-icon': FilterIcon,
    },
  }
</script>

<style scoped>

</style>
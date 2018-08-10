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
        <th v-for="(cell,i) in lastOfGrid" :colspan="cell.colspan" v-show="!cell.hidden" v-html="cell.title" scope="col" :data-tablesaw-priority="!cell.hidden ? 1 : false" :data-sort="cell.id" :class="sortClass(cell.id)" :width="cell.width?cell.width:false" :data-type="cell.sortType?cell.sortType:false"></th>
        <template v-if="controls.dates">
            <th data-sort="createdAt" :class="sortClass('createdAt')">Создан</th>
            <th data-sort="updatedAt" :class="sortClass('updatedAt')">Изменен</th>
        </template>
        <th v-if="controls.edit || controls.remove" :colspan="controls.edit+controls.remove" class="text-center" :width="(controls.edit*43+controls.remove*43)+'px'">Действия</th>
    </tr>
    <tr is="table-filters"></tr>
    </thead>
</template>

<script>
  import Filters from '~components/smart-table/filters';
  import {mapActions, mapGetters, mapState} from 'vuex';

  export default {
    name: "header",
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['editModal']),
      ...mapGetters('table', ['sortBy', 'sortDirection', 'limit', 'controls', 'lastOfGrid', 'grid', 'checkedAll']),

    },
    methods: {
      ...mapActions('table', ['toggleCheckAll']),
      sortClass(id) {
        return {
          'mdl-data-table__header--sorted-ascending': this.sortBy === id && this.sortDirection === 1,
          'mdl-data-table__header--sorted-descending': this.sortBy === id && this.sortDirection === -1,
          'sortable': true,
        }
      },
    },
    components: {
      'table-filters': Filters,
    }
  }
</script>

<style scoped>

</style>
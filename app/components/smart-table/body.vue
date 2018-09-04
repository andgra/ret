<template>
    <tbody>
    <template v-if="rows.length">
        <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" :style="{ backgroundColor: (row.backgroundColor && row.backgroundColor !== '#ffffff') ? row.backgroundColor : '' }">
            <td v-if="controls.checks" class="text-center" width="67px">
                <mdl-checkbox :value="checked(row._id)" @change.native="toggleCheck(row._id)" :disabled="editModal"></mdl-checkbox>
            </td>
            <td @click="openEdit(row._id)" v-if="controls.edit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
                <i class="fa fa-pencil"></i></td>
            <td @click="openRemove([row._id])" v-if="controls.remove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
                <i class="fa fa-times"></i></td>
            <td>{{num(index)}}<input name="_id" v-model="row._id" type="hidden"/></td>
            <td v-for="(cell,j) in visibleCols" :key="cell.id" :class="{'mdl-data-table__cell--non-numeric': !cell.sortType || cell.sortType!=='number'}" :style="cell.style ? cell.style : false">
                <label>{{getValue({row, path: cell.id, cols: visibleCols})}}</label>
            </td>
            <td @click="openEdit(row._id)" v-if="controls.edit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
                <i class="fa fa-pencil"></i></td>
            <td @click="openRemove([row._id])" v-if="controls.remove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
                <i class="fa fa-times"></i></td>
        </tr>
    </template>
    <template v-else>
        <tr>
            <td :colspan="entireColspan" class="text-center" :style="cellOfEmptyRowsStyle">Нет записей</td>
        </tr>
    </template>
    </tbody>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    computed: {
      ...mapState('table', ['rows', 'options']),
      ...mapState('table/edit', ['editModal']),
      ...mapGetters('table', ['controls', 'checked', 'num']),
      ...mapGetters('table/structure', ['lastOfGrid', 'entireColspan']),
      visibleCols() {
        return this.lastOfGrid.filter(cell => (cell.id && cell.colspan && !cell.hidden));
      },
      cellOfEmptyRowsStyle() {
        return {
          padding: '20px !important',
          fontSize: '20px',
          fontWeight: 'bold',
          textDecoration: 'underline',
        };
      },
    },
    methods: {
      ...mapActions('table', ['toggleCheck']),
      ...mapActions('table/edit', ['openEdit']),
      ...mapActions('table/remove', ['openRemove']),
    },
  }
</script>

<style scoped>

</style>
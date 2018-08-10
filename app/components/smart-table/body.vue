<template>
    <tbody>
    <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" v-bind:style="{ backgroundColor: (row.backgroundColor && row.backgroundColor !== '#ffffff') ? row.backgroundColor : '' }">
        <td v-if="controls.checks" class="text-center" width="67px">
            <mdl-checkbox :value="checked(row._id)" @change.native="toggleCheck(row._id)" :disabled="editModal"></mdl-checkbox>
        </td>
        <td @click="openEdit(row._id)" v-if="controls.edit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
            <i class="fa fa-pencil"></i></td>
        <td @click="openRemove([row._id])" v-if="controls.remove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
            <i class="fa fa-times"></i></td>
        <td>{{num(index)}}<input name="_id" v-model="row._id" type="hidden"/></td>
        <td v-for="(cell,j) in lastOfGrid" v-if="cell.id && cell.colspan && !cell.hidden" :class="{'mdl-data-table__cell--non-numeric': !cell.sortType || cell.sortType!=='number'}">
            <label>{{getValue({row, path: cell.id, lastOfGrid})}}</label>
        </td>
        <template v-if="controls.dates">
            <td class="mdl-data-table__cell--non-numeric" style="white-space: nowrap">{{row.createdAt | myDateTime}}</td>
            <td class="mdl-data-table__cell--non-numeric" style="white-space: nowrap">{{row.updatedAt | myDateTime}}</td>
        </template>
        <td @click="openEdit(row._id)" v-if="controls.edit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
            <i class="fa fa-pencil"></i></td>
        <td @click="openRemove([row._id])" v-if="controls.remove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
            <i class="fa fa-times"></i></td>
    </tr>
    </tbody>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    name: "body",
    computed: {
      ...mapState('table', ['rows', 'options', 'editModal']),
      ...mapGetters('table', ['controls', 'lastOfGrid', 'checked', 'num']),

    },
    methods: {
      ...mapActions('table', ['toggleCheck', 'openEdit', 'openRemove']),
    },
  }
</script>

<style scoped>

</style>
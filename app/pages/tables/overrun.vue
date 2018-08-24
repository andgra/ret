<template>
    <div class="table-container">
        <!--<EditedTable :options="options" :inRows="rows">-->
            <!--<template slot="editModal" slot-scope="props">-->
                <!--<mdl-dialog ref="editModal" :title="'Редактирование записи'" :noFocusTrap="true">-->
                    <!--<form class="editing-form" action="#" onsubmit="return false;">-->
                        <!--<mdl-textfield floating-label="цвет заливки" v-model="props.editingRow.backgroundColor" type="color" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Наименование ВВТ" :value="props.editingRow.type"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Положено" :value="props.editingRow.req"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Всего имеется" :value="props.editingRow.real"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="В эксплатуации" :value="props.editingRow.active"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Не эксплотируется" :value="props.editingRow.inactive"></mdl-textfield>-->
                        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Годовой ресурс" v-model="props.editingRow.yearRes"></mdl-textfield>-->
                        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Расход за 1кв. + 2кв." v-model="props.editingRow.consum"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Расход ресурса, %" :value="props.getValue(props.editingRow, 'consumRate')"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label=" " :value="props.getValue(props.editingRow, 'overrun')"></mdl-textfield>-->
                    <!--</form>-->
                    <!--<div slot="actions">-->
                        <!--<mdl-button @click.native="props.closeEdit()">Отменить</mdl-button>-->
                        <!--<mdl-button primary="" @click.native="props.saveRow()">Сохранить</mdl-button>-->
                    <!--</div>-->
                <!--</mdl-dialog>-->
            <!--</template>-->
        <!--</EditedTable>-->
    </div>
</template>

<script>
    // import EditedTable from '../common/EditedTable.vue';
    // import set from 'models/set';
    // import overrun from 'models/overrun';
    // import dictionary from 'models/dictionary';
    //
    // let struct =
    //     [
    //         {hidden: true, id: "backgroundColor", default: '#ffffff'},
    //         {id: "type", title: "Наименование ВВТ", type: 'text', default: "", readonly: true},
    //         {id: "req", title: "Положено", type: 'text', default: 0, readonly: true},
    //         {id: "real", title: "Всего имеется", type: 'text', default: 0, readonly: true},
    //         {id: "active", title: "В эксплатуации", type: 'text', default: 0, readonly: true},
    //         {id: "inactive", title: "Не эксплотируется", type: 'text', default: 0, readonly: true},
    //         {id: "yearRes", title: "Годовой ресурс", type: 'text', default: 0},
    //         {id: "consum", title: "Расход за 1кв. + 2кв.", type: 'text', default: 0},
    //         {id: "consumRate", title: "Расход ресурса", type: 'text', cb(value,entity) { value = entity.consumRate = !!entity.yearRes ? filters.r0(filters.NaN(entity.consum/entity.yearRes*100)) : 0; return value }, default: 0, readonly: true, format: v=>(v+'%')},
    //         {id: "overrun", title: " ", type: 'text', cb(value,entity) { value = entity.overrun = entity.consumRate > 100 ? 'перерасход' : '-'; return value }, default: "", filterType: "select", readonly: true},
    //     ];
    //
    // let options = {
    //     struct,
    //     title: 'Контроль перерасхода',
    //     remove: false,
    //     dates: false,
    //     async setRows() {
    //         let lists = await Promise.all([
    //             set.getItems(),
    //             overrun.getItems(),
    //             dictionary.getDict('type', {'sort': {'value': 1}})
    //         ]);
    //         this.dicts.sets = lists[0];
    //         let dbRows = lists[1];
    //         let typesDict = lists[2];
    //         let types = {
    //             all: [],
    //             req: {},
    //             real: {},
    //             active: {},
    //             inactive: {},
    //         };
    //
    //         for(let set of this.dicts.sets) {
    //             if(types.req[set.type.req])types.req[set.type.req]++;
    //             else types.req[set.type.req]=1;
    //
    //             if(types.real[set.type.real])types.real[set.type.real]++;
    //             else types.real[set.type.real]=1;
    //
    //             types.all.push(set.type.req);
    //             types.all.push(set.type.real);
    //
    //             if(set.condition && set.condition.toLowerCase() == 'свернуто') {
    //                 if(types.inactive[set.type.real])types.inactive[set.type.real]++;
    //                 else types.inactive[set.type.real]=1;
    //             } else {
    //                 if(types.active[set.type.real])types.active[set.type.real]++;
    //                 else types.active[set.type.real]=1;
    //             }
    //         }
    //         for(let type of typesDict) {
    //             types.all.push(type.value);
    //         }
    //         types.all = [...new Set(types.all)];
    //         let rows = [];
    //         for(let type of types.all) {
    //             let dbRow = dbRows.find(item => ( item.type == type ));
    //             let yearRes = !!dbRow ? (!!dbRow.yearRes ? dbRow.yearRes : 0) : 0,
    //                 consum = !!dbRow ? (!!dbRow.consum ? dbRow.consum : 0) : 0;
    //             rows.push({
    //                 _id: type,
    //                 type,
    //                 req: !!types.req[type]?types.req[type]:0,
    //                 real: !!types.real[type]?types.real[type]:0,
    //                 active: !!types.active[type]?types.active[type]:0,
    //                 inactive: !!types.inactive[type]?types.inactive[type]:0,
    //                 yearRes,
    //                 consum,
    //                 consumRate: 0,
    //                 overrun: ''
    //             });
    //         }
    //         this.rows = rows;
    //     },
    //     async saveRow(item) {
    //         return await overrun.updateOrCreate({type:item.type}, item);
    //     },
    //     async removeRow(id) {
    //         await overrun.delete({type:id});
    //     }
    // };
    //
    // let vm = {
    //     data() {
    //         return {
    //             options,
    //             settings: {},
    //             rows: [],
    //             statAsu0: 0,
    //             statAsu1: 0,
    //             statRls0: 0,
    //             statRls1: 0,
    //         }
    //     },
    //     components: {EditedTable},
    //     computed: {
    //         statAsu5: function () {
    //             return this.statAsu0 + this.statAsu1;
    //         },
    //         statRls5: function () {
    //             return this.statRls0 + this.statRls1;
    //         },
    //         stat0: function () {
    //             return this.statAsu0 + this.statRls0;
    //         },
    //         stat1: function () {
    //             return this.statAsu1 + this.statRls1;
    //         },
    //         stat5: function () {
    //             return this.stat0 + this.stat1;
    //         },
    //     },
    //     methods: {
    //         getInterval(d1, d2) {
    //             d1 = moment(d1);
    //             d2 = moment(d2);
    //             return d1.diff(d2, 'minutes');
    //         },
    //         updateStat() {
    //             this.statAsu0 = this.rows.filter(function (item) {
    //                 return item.ret === 'asu' && item.obj === '00000';
    //             }).length;
    //             this.statAsu1 = this.rows.filter(function (item) {
    //                 return item.ret === 'asu' && item.obj === '11111';
    //             }).length;
    //             this.statRls0 = this.rows.filter(function (item) {
    //                 return item.ret === 'rls' && item.obj === '00000';
    //             }).length;
    //             this.statRls1 = this.rows.filter(function (item) {
    //                 return item.ret === 'rls' && item.obj === '11111';
    //             }).length;
    //         },
    //     },
    //     created() {
    //         this.watchCollection(['rows'], this.updateStat, {deep: true});
    //     },
    //     mounted() {
    //
    //         $('#testInp').datetimepicker({
    //             format: 'd.m.Y H:i',
    //         });
    //         console.log($('#testInp'));
    //     }
    // };
    import work from '~api/overrun'

    export default {
      
    };
</script>

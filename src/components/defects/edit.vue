<template>
    <div class="table-container">
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table wide margin-bot">
            <thead>
            <tr>
                <th colspan="4" class="mdl-data-table__cell--non-numeric">
                    <h4>Справка по состоянию РЭТ</h4>
                </th>
            </tr>
            </thead>
            <tbody>

            <tr class="center-all">
                <th class="mdl-data-table__cell--non-numeric"></th>
                <th class="mdl-data-table__cell--non-numeric">всего</th>
                <th class="mdl-data-table__cell--non-numeric">в/ч 00000 (Речинск)</th>
                <th class="mdl-data-table__cell--non-numeric">в/ч 11111 (Заречинск)</th>
            </tr>
            <tr class="center-all">
                <th class="mdl-data-table__cell--non-numeric">РЭТ, из них:</th>
                <td class="mdl-data-table__cell--non-numeric">{{stat5}}</td>
                <td class="mdl-data-table__cell--non-numeric">{{stat0}}</td>
                <td class="mdl-data-table__cell--non-numeric">{{stat1}}</td>
            </tr>
            <tr class="center-all">
                <th class="mdl-data-table__cell--non-numeric">РЛС</th>
                <td class="mdl-data-table__cell--non-numeric">{{statRls5}}</td>
                <td class="mdl-data-table__cell--non-numeric">{{statRls0}}</td>
                <td class="mdl-data-table__cell--non-numeric">{{statRls1}}</td>
            </tr>
            <tr class="center-all">
                <th class="mdl-data-table__cell--non-numeric">АСУ</th>
                <td class="mdl-data-table__cell--non-numeric">{{statAsu5}}</td>
                <td class="mdl-data-table__cell--non-numeric">{{statAsu0}}</td>
                <td class="mdl-data-table__cell--non-numeric">{{statAsu1}}</td>
            </tr>
            </tbody>
        </table>
        <EditedTable :options="options" :inRows="rows">
            <template slot="editModal" slot-scope="props">
                <mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
                    <form class="editing-form" action="#" onsubmit="return false;">
                        <input name="_id" v-model="props.editingRow._id" type="hidden"/>
                        <mdl-autocomplete label="в/ч" v-model="props.editingRow.obj" :options="props.dicts.obj" :strict="true" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="дислокация" v-model="props.editingRow.place"></mdl-textfield>
                        <mdl-select class="mdl-textfield--full-width" id="editingRet" label="РЭТ" v-model="props.editingRow.ret" :options="props.dicts.ret"></mdl-select>
                        <mdl-autocomplete id="editingTypeReq" label="тип РЭТ" v-model="props.editingRow.type" :options="props.dicts.type" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="зав. №" v-model="props.editingRow.zav"></mdl-textfield>
                        <DateTimePicker class="mdl-textfield--full-width" v-model="props.editingRow.failure" label="Дата и время отказа"></DateTimePicker>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Неисправная система" v-model="props.editingRow.faulty"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Принимаемые меры" v-model="props.editingRow.measures" rows="4" :textarea="true" ></mdl-textfield>
                        <DateTimePicker class="mdl-textfield--full-width" v-model="props.editingRow.recovery" label="Дата и время восстановления"></DateTimePicker>
                        <IntervalPicker class="mdl-textfield--full-width" v-model="props.editingRow.zip" :outControl="true" :edit="true" label="Время доставки ЗИП"></IntervalPicker>
                    </form>
                    <div slot="actions">
                        <mdl-button @click.native="props.closeEdit()">Отменить</mdl-button>
                        <mdl-button primary="" @click.native="props.saveRow()">Сохранить</mdl-button>
                    </div>
                </mdl-dialog>
            </template>
        </EditedTable>
    </div>
</template>

<script>
    import EditedTable from '../common/EditedTable.vue';
    import defect from 'models/defect';
    import dictionary from 'models/dictionary';

    let struct =
        [
            {id: "obj", title: "в/ч", type: 'select', default: "", tablefilter: {type: "select"}},
            {id: "place", title: "дислокация", type: 'text', default: ""},
            {id: "ret", title: "РЭТ", type: 'select', items: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}], default: "rls", tablefilter: {type: "select"}},
            {id: "type", title: "Тип РЭТ", type: 'select', default: "", tablefilter: {type: "select"}},
            {id: "zav", title: "зав. №", type: 'text', default: ""},
            {id: "failure", title: "дата и время<br>отказа", type: 'datetime', default: ""},
            {id: "faulty", title: "неисправная<br>система", type: 'text', default: ""},
            {id: "measures", title: "принимаемые меры", type: 'text', default: ""},
            {id: "recovery", title: "дата и время<br>восстановления", type: 'datetime', default: ""},
            {id: "zip", title: "Время доставки<br>ЗИП", type: 'interval', default: 0, width: 150},
        ];

    let options = {
        struct,
        table: 'defects',
        async setDicts() {
            let dicts = await Promise.all([
                dictionary.getDict('obj'),
                dictionary.getDict('ret'),
                dictionary.getDict('type'),
            ]);
            this.dicts.obj =  dicts[0];
            this.dicts.ret =  dicts[1];
            this.dicts.type =  dicts[2];
        },
        async setRows(filter) {
            this.rows = await defect.getItems(filter);
            this.initTf();
        },
        async saveRow(item) {
            return await defect.updateOrCreate({_id:item._id}, item);
        },
        async removeRow(id) {
            await defect.delete(id);
        }
    };

    let vm = {
        data() {
            return {
                options,
                settings: {},
                rows: [],
                statAsu0: 0,
                statAsu1: 0,
                statRls0: 0,
                statRls1: 0,
            }
        },
        components: {EditedTable},
        computed: {
            statAsu5: function () {
                return this.statAsu0 + this.statAsu1;
            },
            statRls5: function () {
                return this.statRls0 + this.statRls1;
            },
            stat0: function () {
                return this.statAsu0 + this.statRls0;
            },
            stat1: function () {
                return this.statAsu1 + this.statRls1;
            },
            stat5: function () {
                return this.stat0 + this.stat1;
            },
        },
        methods: {
            getInterval(d1, d2) {
                d1 = moment(d1);
                d2 = moment(d2);
                return d1.diff(d2, 'minutes');
            },
            updateStat() {
                this.statAsu0 = this.rows.filter(function (item) {
                    return item.ret === 'АСУ' && item.obj === '00000';
                }).length;
                this.statAsu1 = this.rows.filter(function (item) {
                    return item.ret === 'АСУ' && item.obj === '11111';
                }).length;
                this.statRls0 = this.rows.filter(function (item) {
                    return item.ret === 'РЛС' && item.obj === '00000';
                }).length;
                this.statRls1 = this.rows.filter(function (item) {
                    return item.ret === 'РЛС' && item.obj === '11111';
                }).length;
            },
        },
        created() {
            this.watchCollection(['rows'], this.updateStat, {deep: true});
        },
        mounted() {

            $('#testInp').datetimepicker({
                format: 'd.m.Y H:i',
            });
            console.log($('#testInp'));
        }
    };

    export default vm;
</script>

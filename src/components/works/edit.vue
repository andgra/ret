<template>
    <div class="table-container">
        <EditedTable :options="options" :inRows="rows">
            <template slot="editModal" slot-scope="props">
                <mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
                    <form class="editing-form" action="#">
                        <input name="_id" v-model="props.editingRow._id" type="hidden"/>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="в/ч" v-model="props.editingRow.obj"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="дислокация" v-model="props.editingRow.place"></mdl-textfield>
                        <!--<mdl-select class="mdl-textfield&#45;&#45;full-width" id="editingRet" label="РЭТ" v-model="props.editingRow.ret" :options="props.getItems('ret')"></mdl-select>-->
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Тип РЭТ" v-model="props.editingRow.type"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="зав. №" v-model="props.editingRow.zav"></mdl-textfield>
                        <DateTimePicker class="mdl-textfield--full-width" v-model="props.editingRow.arrival" label="Дата прибытия" :time="false"></DateTimePicker>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Наименование работ, обслуживаемая система ВВСТ" v-model="props.editingRow.title" rows="4" :textarea="true" ></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Предприятие промышленности" v-model="props.editingRow.factory" ></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Кол-во чел." v-model="props.editingRow.people" type="number" ></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Старший бригады - ФИО, моб. тел." v-model="props.editingRow.senior" rows="2" :textarea="true" ></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Представитель от в/ч (подразделения)" v-model="props.editingRow.envoy" ></mdl-textfield>
                        <DateTimePicker class="mdl-textfield--full-width" v-model="props.editingRow.departure" label="Дата убытия" :time="false"></DateTimePicker>
                    </form>
                    <div slot="actions">
                        <mdl-button @click.native="$refs.editModal.close">Отменить</mdl-button>
                        <mdl-button primary="" @click.native="props.saveRow()">Сохранить</mdl-button>
                    </div>
                </mdl-dialog>
            </template>
        </EditedTable>
    </div>
</template>

<script>
    import EditedTable from '../common/EditedTable.vue';
    import work from 'models/work';

    let struct =
        [
            {id: "obj", title: "в/ч", type: 'text', default: "", tablefilter: {type: "select"}},
            {id: "place", title: "дислокация", type: 'text', default: ""},
//            {id: "ret", title: "РЭТ", type: 'select', items: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}], default: "rls", tablefilter: {type: "select"}},
            {id: "type", title: "Тип РЭТ", type: 'text', default: "", tablefilter: {type: "select"}},
            {id: "zav", title: "зав. №", type: 'text', default: ""},
            {id: "arrival", title: "Дата прибытия", type: 'date', default: ""},
            {id: "title", title: "Наименование работ,<br>обслуживаемая система<br>ВВСТ", type: 'text', default: ""},
            {id: "factory", title: "Предприятие<br>промышленности", type: 'text', default: ""},
            {id: "people", title: "Кол-во<br>чел.", type: 'number', default: 0},
            {id: "senior", title: "Старший бригады<br>ФИО, моб. тел.", type: 'text', default: ""},
            {id: "envoy", title: "Представитель от<br>в/ч (подразделения)", type: 'text', default: ""},
            {id: "departure", title: "Дата<br>убытия", type: 'date', default: ""},
        ];

    let options = {
        struct,
        table: 'works',
        title: 'Таблица контроля работ представителя промышленности',
        data: {
            perPage: 7,
        },
        async setRows(filter) {
            this.rows = await work.getItems(filter);
            this.initTf();
        },
        async saveRow(item) {
            return await work.updateOrCreate(item);
        },
        async removeRow(id) {
            await work.delete(id);
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
                    return item.ret === 'asu' && item.obj === '00000';
                }).length;
                this.statAsu1 = this.rows.filter(function (item) {
                    return item.ret === 'asu' && item.obj === '11111';
                }).length;
                this.statRls0 = this.rows.filter(function (item) {
                    return item.ret === 'rls' && item.obj === '00000';
                }).length;
                this.statRls1 = this.rows.filter(function (item) {
                    return item.ret === 'rls' && item.obj === '11111';
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

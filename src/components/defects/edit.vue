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
                <th class="mdl-data-table__cell--non-numeric">соединение</th>
                <template v-for="obj in objDict">
                    <th class="mdl-data-table__cell--non-numeric">в/ч {{obj.value}}</th>
                </template>
            </tr>
            <tr class="center-all">
                <th class="mdl-data-table__cell--non-numeric">РЭТ, из них:</th>
                <th class="mdl-data-table__cell--non-numeric">{{stats.total?stats.total.total:''}}</th>
                <template v-for="obj in objDict">
                    <td class="mdl-data-table__cell--non-numeric">{{stats[obj.value].total}}</td>
                </template>
            </tr>
            <template v-for="ret in retDict">
                <tr class="center-all">
                    <th class="mdl-data-table__cell--non-numeric">{{ret.value}}</th>
                    <td class="mdl-data-table__cell--non-numeric">{{stats.total[ret.value]}}</td>
                    <template v-for="obj in objDict">
                        <td class="mdl-data-table__cell--non-numeric">{{stats[obj.value][ret.value]}}</td>
                    </template>
                </tr>
            </template>
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
            {id: "failure", title: "дата и время <br>отказа", type: 'datetime', default: ""},
            {id: "faulty", title: "неисправная <br>система", type: 'text', default: ""},
            {id: "measures", title: "принимаемые меры", type: 'text', default: ""},
            {id: "recovery", title: "дата и время <br>восстановления", type: 'datetime', default: ""},
            {id: "zip", title: "Время доставки <br>ЗИП", type: 'interval', default: 0, width: 150},
        ];

    let options = {
        struct,
        table: 'defects',
        async setRows(filter) {
            let awaited = await Promise.all([
                defect.getItems(filter),
                dictionary.getDict('ret', {'sort': {'value': 1}}),
                dictionary.getDict('obj', {'sort': {'value': 1}}),
                dictionary.getDict('type', {'sort': {'value': 1}}),
            ]);
            this.$parent.rows = this.rows = awaited[0];
            this.$parent.retDict = this.dicts.ret = awaited[1];
            this.$parent.objDict = this.dicts.obj = awaited[2];
            this.dicts.type =  awaited[3];
            this.$parent.updateStats();
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
                objDict: [],
                retDict: [],
                stats: {},
            }
        },
        components: {EditedTable},
        methods: {
            getInterval(d1, d2) {
                d1 = moment(d1);
                d2 = moment(d2);
                return d1.diff(d2, 'minutes');
            },
            updateStats() {
                let stats = {}
                for(let obj of this.objDict) {
                    stats[obj.value] = {total: 0};
                    for(let ret of this.retDict) {
                        stats[obj.value][ret.value] = 0;
                    }
                }
                stats['total'] = {total: 0};
                for(let ret of this.retDict) {
                    stats['total'][ret.value] = 0;
                }

                for(let obj of this.objDict) {
                    for(let ret of this.retDict) {
                        stats[obj.value][ret.value] = this.rows.filter(function (item) {
                            return item.obj === obj.value && item.ret === ret.value;
                        }).length;
                        stats[obj.value].total += stats[obj.value][ret.value];
                    }
                }

                for(let ret of this.retDict) {
                    stats['total'][ret.value] = 0;
                    for(let obj of this.objDict) {
                        stats['total'][ret.value] += stats[obj.value][ret.value];
                    }
                    stats['total'].total += stats['total'][ret.value];
                }
                this.stats = stats;
            }
        },
        created() {
            this.watchCollection(['rows'], this.updateStats, {deep: true});
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

<template>
    <div class="table-container">
        <EditedTable :options="options" :inRows="rows">
            <template slot="editModal" slot-scope="props">
                <mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
                    <form class="editing-form" action="#" onsubmit="return false;">
                        <input name="_id" v-model="props.editingRow._id" type="hidden"/>
                        <mdl-autocomplete label="в/ч" v-model="props.editingRow.obj" :options="props.dicts.obj" :strict="true" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-textfield floating-label="дислокация" v-model="props.editingRow.place" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-select id="editingRet" label="РЭТ" v-model="props.editingRow.ret" :options="props.dicts.ret" class="mdl-textfield--full-width"></mdl-select>
                        <mdl-textfield floating-label="наличие пн" v-model="props.editingRow.pn" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-autocomplete id="editingTypeReq" label="тип РЭТ по штату" v-model="props.editingRow.type.req" :options="props.dicts.type.req" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-textfield floating-label="тип РЭТ в наличии" v-model="props.editingRow.type.real" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-textfield floating-label="заводской номер" v-model="props.editingRow.serial" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-textfield floating-label="год изготовления" v-model="props.editingRow.serial" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                        <div class="form-group">
                            <p>вид и год последнего ремонта</p>
                            <div class="form-indent">
                                <mdl-select id="editingRepairType" label="вид" v-model="props.editingRow.repair.type" :options="props.dicts.repair.type" class="mdl-textfield--full-width"></mdl-select>
                                <mdl-textfield floating-label="год" v-model="props.editingRow.repair.year" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <mdl-select id="editingCondition" label="состояние РЭТ" v-model="props.editingRow.condition" :options="props.dicts.condition" class="mdl-textfield--full-width"></mdl-select>
                        <div class="form-group">
                            <p>отв. за эксплуатацию, уход и сбережение</p>
                            <div class="form-indent">
                                <mdl-textfield floating-label="воинское звание" v-model="props.editingRow.resp.rank" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="ФИО" v-model="props.editingRow.resp.fio" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="приказ о закреплении" v-model="props.editingRow.resp.order" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>установленный ресурс РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield floating-label="ресурс до КР (час.)" v-model="props.editingRow.est.res.kr" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="ресурс до списания (час.)" v-model="props.editingRow.est.res.cancel" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="срок службы до КР (лет)" v-model="props.editingRow.est.life.kr" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="срок службы до списания (лет)" v-model="props.editingRow.est.life.cancel" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>наработка РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield :floating-label="'наработка с начала эксплуатации на '+settings.startDate+' (час.)'" v-model="props.editingRow.elabor.elabor.total" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="наработка до КР (час.)" v-model="props.editingRow.elabor.elabor.before" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="наработка после КР (час.)" v-model="props.editingRow.elabor.elabor.after" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="отработано ВСЕГО (лет)" v-model="props.editingRow.elabor.dev.total" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="отработано до КР (лет)" v-model="props.editingRow.elabor.dev.before" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="отработано после КР (лет)" v-model="props.editingRow.elabor.dev.after" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>Запас ресурса образца РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield readonly="" floating-label="до КР (лет)" :value="props.getValue(props.editingRow, 'stock.year.kr.num')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (%)" :value="props.getValue(props.editingRow, 'stock.year.kr.per')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (лет)" :value="props.getValue(props.editingRow, 'stock.year.cancel.num')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (%)" :value="props.getValue(props.editingRow, 'stock.year.cancel.per')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (час)" :value="props.getValue(props.editingRow, 'stock.hour.kr.num')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (%)" :value="props.getValue(props.editingRow, 'stock.hour.kr.per')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (час)" :value="props.getValue(props.editingRow, 'stock.hour.cancel.num')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (%)" :value="props.getValue(props.editingRow, 'stock.hour.cancel.per')" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
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
    //    import EditedTable from '../mixins/edited-table';
    import EditedTable from '../common/EditedTable.vue';
    import set from 'models/set';
    import settings from 'models/settings';
    import dictionary from 'models/dictionary';

    let struct =
        [
            {id: "obj", title: "в/ч", type: 'select', default: "", tablefilter: {type: "select"}},
            {id: "place", title: "дислокация", type: 'text', default: ""},
            {id: "ret", title: "РЭТ", type: 'select', default: "РЛС", tablefilter: {type: "select"}},
            {id: "pn", title: "Наличие<br>ПН", type: 'text', default: "", tablefilter: {type: "select"}},
            {
                id: "type", title: "", children:
                [
                    {id: "req", title: "Тип РЭТ<br>по штату", type: 'select', default: "", tablefilter: {type: "select"}},
                    {id: "real", title: "Тип РЭТ<br>в наличии", type: 'text', default: "", tablefilter: {type: "select"}},
                ]
            },
            {id: "serial", title: "Заводской<br>номер", type: 'text', default: ""},
            {id: "year", title: "Год<br>изготовления", type: 'number', default: 0, tablesaw: {type: "number"}},
            {
                id: "repair", title: "Вид и год последнего ремонта", children:
                [
                    {id: "type", title: "Вид", type: 'select', items: [{name: 'КР', value: 'kr'}, {name: 'РТС', value: 'rts'}], default: "rk", tablefilter: {type: "select"}},
                    {id: "year", title: "Год", type: 'number', default: 0, tablesaw: {type: "number"}},
                ]
            },
            {id: "condition", title: "Состояние РЭТ", type: 'select', items: [{name: 'Свернуто', value: 'closed'}, {name: 'Находится в эксплуатации', value: 'in_prod'}], default: "in_prod", tablefilter: {type: "select"}},
            {
                id: "resp", title: "Отв. за эксплуатацию, уход и сбережение", children:
                [
                    {id: "rank", title: "В/зв", type: 'text', default: ""},
                    {id: "fio", title: "Ф.И.О.", type: 'text', default: ""},
                    {id: "order", title: "Пр. о закреплении", type: 'text', default: ""},
                ]
            },
            {
                id: "est", title: "Установленный ресурс РЭТ", children:
                [
                    {
                        id: "res", title: "", children:
                        [
                            {id: "kr", title: "ресурс до<br>КР (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "cancel", title: "ресурс до<br>списания (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                        ]
                    },
                    {
                        id: "life", title: "", children:
                        [
                            {id: "kr", title: "срок службы<br>до КР (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "cancel", title: "срок службы<br>до списания (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                        ]
                    }
                ]
            },
            {
                id: "elabor", title: "Наработка РЭТ", children:
                [
                    {
                        id: "elabor", title: "", children:
                        [
                            {id: "total", title: "наработка с начала<br>эксплуатации на<br>01.07.17 (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "before", title: "наработка до<br>КР (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "after", title: "наработка после<br>КР (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                        ]
                    },
                    {
                        id: "dev", title: "", children:
                        [
                            {id: "total", title: "отработано<br>ВСЕГО (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "before", title: "отработано<br>до КР (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "after", title: "отработано<br>после КР (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                        ]
                    }
                ]
            },
            {
                id: "stock", title: "Запас ресурса образца РЭТ", children:
                [
                    {
                        id: "year", title: "", children:
                        [
                            {
                                id: "kr", title: "Запас ресурса до КР", children:
                                [
                                    {id: "num", title: "лет", type: 'text', cb(value,entity) { value = entity.stock.year.kr.num = filters.r2(filters.NaN(entity.est.life.kr - entity.elabor.dev.before)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                    {id: "per", title: "%", type: 'text', cb(value,entity) { value = entity.stock.year.kr.per = filters.r2(filters.NaN(entity.elabor.dev.before/entity.est.life.kr*100)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                ]
                            },
                            {
                                id: "cancel", title: "Запас ресурса до списания", children:
                                [
                                    {id: "num", title: "лет", type: 'text', cb(value,entity) { value = entity.stock.year.cancel.num = filters.r2(filters.NaN(entity.est.life.cancel - entity.elabor.elabor.total)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                    {id: "per", title: "%", type: 'text', cb(value,entity) { value = entity.stock.year.cancel.per = filters.r2(filters.NaN(entity.elabor.elabor.total/entity.est.life.cancel*100)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                ]
                            }
                        ]
                    },
                    {
                        id: "hour", title: "", children:
                        [
                            {
                                id: "kr", title: "Запас ресурса до КР", children:
                                [
                                    {id: "num", title: "час", type: 'text', cb(value,entity) { value = entity.stock.hour.kr.num = filters.r2(filters.NaN(entity.est.res.kr - entity.elabor.elabor.before)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                    {id: "per", title: "%", type: 'text', cb(value,entity) { value = entity.stock.hour.kr.per = filters.r2(filters.NaN(entity.elabor.elabor.before/entity.est.res.kr*100)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                ]
                            },
                            {
                                id: "cancel", title: "Запас ресурса до списания", children:
                                [
                                    {id: "num", title: "час", type: 'text', cb(value,entity) { value = entity.stock.hour.cancel.num = filters.r2(filters.NaN(entity.est.res.cancel - entity.elabor.elabor.total)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                    {id: "per", title: "%", type: 'text', cb(value,entity) { value = entity.stock.hour.cancel.per = filters.r2(filters.NaN(entity.elabor.elabor.total/entity.est.life.cancel*100)); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
                                ]
                            }
                        ]
                    },
                ]
            },
        ];



    let options = {
        struct,
        table: 'sets',
        title: 'Таблица сводных данных',
        data: {
            perPage: 7,
            settings: {},
            retArray: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}],
            repairTypeArray: [{name: 'КР', value: 'kr'}, {name: 'РТС', value: 'rts'}],
            conditionArray: [{name: 'Свернуто', value: 'closed'}, {name: 'Находится в эксплуатации', value: 'in_prod'}],
        },
        methods: {
            async startDateSelect(newVal) {
                await (settings.startDate = newVal);
                this.$root.$emit('msgSent', {message: 'Дата изменена'});
                this.settings.startDate = newVal;

                // filter
                this.setRows({startDate: newVal})
            },
        },
        computed: {},
        async mounted() {
            let startDate = setting.startDate;
            let $startDate = $('#startDate');
            if ($startDate.next('button').button("option", "label")) {
                $startDate.val(startDate);
                $startDate.next('button').button("option", "label", startDate);
            }
            this.settings.startDate = startDate;
            this.setRows({startDate: this.settings.startDate});
        },
        init: function () {

        },
        async setDicts() {
            let dicts = await Promise.all([
                dictionary.getDict('obj'),
                dictionary.getDict('ret'),
                dictionary.getDict('type'),
                dictionary.getDict('repair'),
                dictionary.getDict('condition'),
            ]);
            this.dicts.obj =  dicts[0];
            this.dicts.ret =  dicts[1];
            this.dicts.type.req =  dicts[2];
            this.dicts.repair.type =  dicts[3];
            this.dicts.condition =  dicts[4];
        },
        async setRows(filter) {
            this.rows = await set.getItems(filter);
            this.initTf();
        },
        async saveRow(item) {
            return await set.updateOrCreate({_id:item._id}, item);
        },
        async removeRow(id) {
            await set.delete(id);
        }
    };

    export default {
        data() {
            return {
                options,
                settings: {},
                rows: []
            }
        },
        components: {EditedTable}
    };
</script>

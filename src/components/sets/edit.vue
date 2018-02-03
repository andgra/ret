<template lang="pug">
    div.table-container
        EditedTable(:options="options", :inRows="rows")
            template(slot="editModal", slot-scope="props")
                mdl-dialog(ref="editModal", :title="props.editingRow._id?'Редактирование записи':'Добавление записи'")
                    form.editing-form(action='#')
                        input(name='_id', v-model='props.editingRow._id', type='hidden')
                        mdl-textfield.mdl-textfield--full-width(floating-label='в/ч', v-model='props.editingRow.obj')
                        mdl-textfield.mdl-textfield--full-width(floating-label='дислокация', v-model='props.editingRow.place')
                        mdl-select#editingRet.mdl-textfield--full-width(label='РЭТ', v-model='props.editingRow.ret', :options='props.getItems("ret")')
                        mdl-textfield.mdl-textfield--full-width(floating-label='наличие пн', v-model='props.editingRow.pn')
                        mdl-textfield.mdl-textfield--full-width(floating-label='тип РЭТ по штату', v-model='props.editingRow.type.req')
                        mdl-textfield.mdl-textfield--full-width(floating-label='тип РЭТ в наличии', v-model='props.editingRow.type.real')
                        mdl-textfield.mdl-textfield--full-width(floating-label='заводской номер', v-model='props.editingRow.serial')
                        mdl-textfield.mdl-textfield--full-width(floating-label='год изготовления', v-model='props.editingRow.serial', type='number')
                        .form-group
                            p вид и год последнего ремонта
                            .form-indent
                                mdl-select#editingRepairType.mdl-textfield--full-width(label='вид', v-model='props.editingRow.repair.type', :options='props.getItems("repair.type")')
                                mdl-textfield.mdl-textfield--full-width(floating-label='год', v-model='props.editingRow.repair.year', type='number')
                        mdl-select#editingCondition.display-block(label='состояние РЭТ', v-model='props.editingRow.condition', :options='props.getItems("condition")')
                        .form-group
                            p отв. за эксплуатацию, уход и сбережение
                            .form-indent
                                mdl-textfield.mdl-textfield--full-width(floating-label='воинское звание', v-model='props.editingRow.resp.rank')
                                mdl-textfield.mdl-textfield--full-width(floating-label='ФИО', v-model='props.editingRow.resp.fio')
                                mdl-textfield.mdl-textfield--full-width(floating-label='приказ о закреплении', v-model='props.editingRow.resp.order')
                        .form-group
                            p установленный ресурс РЭТ
                            .form-indent
                                mdl-textfield.mdl-textfield--full-width(floating-label='ресурс до КР (час.)', v-model='props.editingRow.est.res.kr', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='ресурс до списания (час.)', v-model='props.editingRow.est.res.cancel', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='срок службы до КР (лет)', v-model='props.editingRow.est.life.kr', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='срок службы до списания (лет)', v-model='props.editingRow.est.life.cancel', type='number')
                        .form-group
                            p наработка РЭТ
                            .form-indent
                                mdl-textfield.mdl-textfield--full-width(:floating-label="'наработка с начала эксплуатации на '+settings.startDate+' (час.)'", v-model='props.editingRow.elabor.elabor.total', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='наработка до КР (час.)', v-model='props.editingRow.elabor.elabor.before', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='наработка после КР (час.)', v-model='props.editingRow.elabor.elabor.after', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='отработано ВСЕГО (лет)', v-model='props.editingRow.elabor.dev.total', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='отработано до КР (лет)', v-model='props.editingRow.elabor.dev.before', type='number')
                                mdl-textfield.mdl-textfield--full-width(floating-label='отработано после КР (лет)', v-model='props.editingRow.elabor.dev.after', type='number')
                        .form-group
                            p Запас ресурса образца РЭТ
                            .form-indent
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (лет)', :value='props.getValue(props.editingRow, "stock.year.kr.num")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (%)', :value='props.getValue(props.editingRow, "stock.year.kr.per")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (лет)', :value='props.getValue(props.editingRow, "stock.year.cancel.num")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (%)', :value='props.getValue(props.editingRow, "stock.year.cancel.per")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (час)', :value='props.getValue(props.editingRow, "stock.hour.kr.num")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (%)', :value='props.getValue(props.editingRow, "stock.hour.kr.per")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (час)', :value='props.getValue(props.editingRow, "stock.hour.cancel.num")', type='number')
                                mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (%)', :value='props.getValue(props.editingRow, "stock.hour.cancel.per")', type='number')
                    div(slot='actions')
                        mdl-button(@click.native='$refs.editModal.close') Отменить
                        mdl-button(primary='', @click.native='props.saveRow()') Сохранить
</template>

<script>
    //    import EditedTable from '../mixins/edited-table';
    import EditedTable from '../common/EditedTable.vue';
    import set from 'models/set';
    import settings from 'models/settings';

    let struct =
        [
            {id: "obj", title: "в/ч", type: 'text', default: "", tablefilter: {type: "select"}},
            {id: "place", title: "дислокация", type: 'text', default: ""},
            {id: "ret", title: "РЭТ", type: 'select', items: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}], default: "rls", tablefilter: {type: "select"}},
            {id: "pn", title: "Наличие<br>ПН", type: 'text', default: "", tablefilter: {type: "select"}},
            {
                id: "type", title: "", children:
                [
                    {id: "req", title: "Тип РЭТ<br>по штату", type: 'text', default: "", tablefilter: {type: "select"}},
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
        async setRows(filter) {
            this.rows = await set.getItems(filter);
            this.initTf();
        },
        async saveRow(item) {
            return await set.updateOrCreate(item);
        },
        async removeRow(id) {
            await set.delete(id);
        }
    };

    let vm = {
        data() {
            return {
                options,
                settings: {},
                rows: []
            }
        },
        components: {EditedTable}
    };

    export default vm;
</script>

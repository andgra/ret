<template lang="pug">
    div.table-container
        EditedTable(:options="options", :inRows="rows")
</template>

<script>
    //    import EditedTable from '../mixins/edited-table';
    import EditedTable from '../common/EditedTable.vue';

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
                                    {id: "num", title: "час", type: 'text', cb(value,entity) { Vue.set(entity.stock.hour.kr,'num',filters.r2(filters.NaN(entity.est.res.kr - entity.elabor.elabor.before))); value = entity.stock.hour.kr.num; console.log(entity.stock.hour.kr); return value }, default: "", tablesaw: {type: "number"}, readonly: true},
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
            startDateSelect: function (newVal) {
                if (this.settings.startDate) {
                    db.update({
                        table: 'settings',
                        key: 'startDate'
                    }, {$set: {value: newVal}}, $.proxy(function (err, item) {
                        this.$root.$emit('msgSent', {message: 'Дата изменена'})
                    }, this));
                } else {
                    db.insert({
                        table: 'settings',
                        key: 'startDate',
                      value: newVal
                    }, $.proxy(function (err, item) {
                        this.$root.$emit('msgSent', {message: 'Дата изменена'})
                        this.settings.startDate = newVal;
                    }, this));
                }

                // filter
                this.setRows({startDate: newVal})
            },
        },
        computed: {},
        mounted: function () {
            db.find({table: 'settings'}).exec($.proxy(function (err, rows) {
                let $startDate = $('#startDate');
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    if (row.key === 'startDate') {
                        if ($startDate.next('button').button("option", "label")) {
                            $startDate.val(row.value);
                            $startDate.next('button').button("option", "label", row.value);
                        }
                        this.settings.startDate = row.value;
                    }
                }
                this.setRows({startDate: this.settings.startDate})
            }, this));
        },
        init: function () {

        },
        setRows: function (filter) {
            db.find({
                table: 'sets', $where: function () {
                    if (!filter || !filter.startDate)
                        return true;
                    return moment(this.createdAt) > moment(filter.startDate, "DD.MM.YYYY");
                }
            }).sort({createdAt: 1}).exec($.proxy(function (err, rows) {
                this.rows = rows;
                this.initTf();
            }, this));
        },
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

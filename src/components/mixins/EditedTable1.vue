<template lang="pug">
    div.table-container
        table#table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp.border-all-cells.edited-table(data-tablesaw-mode='columntoggle', ref='table')
            thead
                tr(data-tablesaw-ignorerow='')
                    th.mdl-data-table__cell--non-numeric(:colspan='selFooter')
                        h4 Таблица сводных данных
                tr.center-all(data-tablesaw-ignorerow='')
                    th(:colspan='selFirstFirst')
                    th(:colspan='getSelCnt(sel.stock)', v-if='getSelCnt(sel.stock)') Запас ресурса образца РЭТ
                    th(:colspan='selFirstLast')
                tr.center-all(data-tablesaw-ignorerow='')
                    th(:colspan='selSecondFirst')
                    th(:colspan='getSelCnt(sel.repair)', v-if='getSelCnt(sel.repair)') Вид и год последнего ремонта
                    th(v-if='sel.condition')
                    th(:colspan='getSelCnt(sel.resp)', v-if='getSelCnt(sel.resp)') Отв. за эксплуатацию, уход и сбережение
                    th(:colspan='getSelCnt(sel.est)', v-if='getSelCnt(sel.est)') Установленный ресурс РЭТ
                    th(:colspan='getSelCnt(sel.elabor)', v-if='getSelCnt(sel.elabor)') Наработка РЭТ
                    th(:colspan='getSelCnt(sel.stock.year.kr)', v-if='getSelCnt(sel.stock.year.kr)') Запас ресурса до КР
                    th(:colspan='getSelCnt(sel.stock.year.cancel)', v-if='getSelCnt(sel.stock.year.cancel)') Запас ресурса до списания
                    th(:colspan='getSelCnt(sel.stock.hour.kr)', v-if='getSelCnt(sel.stock.hour.kr)') Запас ресурса до КР
                    th(:colspan='getSelCnt(sel.stock.hour.cancel)', v-if='getSelCnt(sel.stock.hour.cancel)') Запас ресурса до списания
                    th(:colspan='selFirstLast')
                tr.center-all.wide-all
                    th.mdl-th-padding
                        mdl-checkbox#checkAll(v-model='checkAll', @change.native='toggleCheckAll', :disabled='edit!==-1')
                    th(colspan='2') Действия
                    th(scope='col') №
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='obj') в/ч
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='place') дислокация
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='ret') РЭТ
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='pn')
                        | Наличие
                        br
                        | ПН
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='type.req')
                        | Тип РЭТ
                        br
                        | по штату
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='type.real')
                        | Тип РЭТ
                        br
                        | в наличии
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='serial')
                        | Заводской
                        br
                        | номер
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='year', data-type='number')
                        | Год
                        br
                        | изготовления
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='repair.type') Вид
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='repair.year', data-type='number') Год
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='condition') Состояние РЭТ
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='resp.rank') В/зв
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='resp.fio') Ф.И.О.
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='resp.order') Пр. о закреплении
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='est.res.kr', data-type='number')
                        | ресурс до
                        br
                        | КР (час.)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='est.res.cancel', data-type='number')
                        | ресурс до
                        br
                        | списания (час.)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='est.life.kr', data-type='number')
                        | срок службы до
                        br
                        | КР (лет)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='est.life.cancel', data-type='number')
                        | срок службы до
                        br
                        | списания (лет)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='elabor.elabor.total', data-type='number')
                        | наработка с начала
                        br
                        | эксплуатации на
                        // 01.07.17
                        br
                        datepicker#startDate(:value="settings.startDate ? settings.startDate : '01.01.2017'", :onselect='startDateSelect', :isbutton='true')
                        // <mdl-button style="width: 90px"></mdl-button>
                        | (час.)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='elabor.elabor.before', data-type='number')
                        | наработка
                        br
                        | до КР (час.)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='elabor.elabor.after', data-type='number')
                        | наработка
                        br
                        | после КР (час.)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='elabor.dev.total', data-type='number')
                        | отработано
                        br
                        | ВСЕГО (лет)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='elabor.dev.before', data-type='number')
                        | отработано
                        br
                        | до КР (лет)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='elabor.dev.after', data-type='number')
                        | отработано
                        br
                        | после КР (лет)
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.year.kr.num', data-type='number') лет
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.year.kr.per', data-type='number') %
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.year.cancel.num', data-type='number') лет
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.year.cancel.per', data-type='number') %
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.hour.kr.num', data-type='number') час
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.hour.kr.per', data-type='number') %
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.hour.cancel.num', data-type='number') час
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='stock.hour.cancel.per', data-type='number') %
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='createdAt') Создан
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='updatedAt') Изменен
                    th(colspan='2') Действия
            tbody
                // v-if="index>=(page-1)*perPage && index<page*perPage"
                tr(v-for='(row, index) in rows', :key='row.num', :data-id='index')
                    td
                        mdl-checkbox(v-model='checks', :val='index', :disabled='edit!==-1')
                    td.clickable.tooltip(@click='editRow(index)', data-tooltip='Редактировать')
                        i.fa.fa-pencil
                    td.clickable.tooltip(@click='inquireRemove([index])', data-tooltip='Удалить')
                        i.fa.fa-times
                    td
                        | {{index+1}}
                        input(name='_id', v-model='row._id', type='hidden')
                    td.mdl-data-table__cell--non-numeric(v-if='sel.obj')
                        label {{row.obj}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.place')
                        label {{row.place}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.ret')
                        label {{getName(retArray,row.ret)}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.pn')
                        label {{row.pn}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.type.req')
                        label {{row.type.req}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.type.real')
                        label {{row.type.real}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.serial')
                        label {{row.serial}}
                    td(v-if='sel.year')
                        label {{row.year}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.repair.type')
                        label {{getName(repairTypeArray, row.repair.type)}}
                    td(v-if='sel.repair.year')
                        label {{row.repair.year}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.condition')
                        label {{getName(conditionArray, row.condition)}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.resp.rank')
                        label {{row.resp.rank}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.resp.fio')
                        label {{row.resp.fio}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.resp.order')
                        label {{row.resp.order}}
                    td(v-if='sel.est.res.kr')
                        label {{row.est.res.kr}}
                    td(v-if='sel.est.res.cancel')
                        label {{row.est.res.cancel}}
                    td(v-if='sel.est.life.kr')
                        label {{row.est.life.kr}}
                    td(v-if='sel.est.life.cancel')
                        label {{row.est.life.cancel}}
                    td(v-if='sel.elabor.elabor.total')
                        label {{row.elabor.elabor.total}}
                    td(v-if='sel.elabor.elabor.before')
                        label {{row.elabor.elabor.before}}
                    td(v-if='sel.elabor.elabor.after')
                        label {{row.elabor.elabor.after}}
                    td(v-if='sel.elabor.dev.total')
                        label {{row.elabor.dev.total}}
                    td(v-if='sel.elabor.dev.before')
                        label {{row.elabor.dev.before}}
                    td(v-if='sel.elabor.dev.after')
                        label {{row.elabor.dev.after}}
                    td(v-if='sel.stock.year.kr.num') {{row.stock.year.kr.num = row.est.life.kr - row.elabor.dev.before | NaN | r2}}
                    td(v-if='sel.stock.year.kr.per') {{row.stock.year.kr.per = row.elabor.dev.before/row.est.life.kr*100 | NaN | r2}}
                    td(v-if='sel.stock.year.cancel.num')
                        | {{row.stock.year.cancel.num = row.est.life.cancel - row.elabor.elabor.total | NaN | r2}}
                    td(v-if='sel.stock.year.cancel.per')
                        | {{row.stock.year.cancel.per = row.elabor.elabor.total/row.est.life.cancel*100 | NaN | r2}}
                    td(v-if='sel.stock.hour.kr.num') {{row.stock.hour.kr.num = row.est.res.kr - row.elabor.elabor.before | NaN | r2}}
                    td(v-if='sel.stock.hour.kr.per')
                        | {{row.stock.hour.kr.per = row.elabor.elabor.before/row.est.res.kr*100 | NaN | r2}}
                    td(v-if='sel.stock.hour.cancel.num')
                        | {{row.stock.hour.cancel.num = row.est.res.cancel - row.elabor.elabor.total | NaN | r2}}
                    td(v-if='sel.stock.hour.cancel.per')
                        | {{row.stock.hour.cancel.per = row.elabor.elabor.total/row.est.life.cancel*100 | NaN | r2}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.createdAt') {{row.createdAt | myDateTime}}
                    td.mdl-data-table__cell--non-numeric(v-if='sel.updatedAt') {{row.updatedAt | myDateTime}}
                    td.clickable.tooltip(@click='editRow(index)', data-tooltip='Редактировать')
                        i.fa.fa-pencil
                    td.clickable.tooltip(@click='inquireRemove([index])', data-tooltip='Удалить')
                        i.fa.fa-times
            tfoot
                tr
                    td.mdl-data-table__cell--non-numeric(:colspan='selFooter')
                        #paging
                tr
                    td.mdl-data-table__cell--non-numeric(:colspan='selFooter')
                        mdl-button.mdl-js-ripple-effect(:disabled='edit!==-1', @click.native='editRow(rows.index)') Добавить запись
                        mdl-button.mdl-js-ripple-effect(:disabled='edit!==-1 || checks.length===0', @click.native='inquireRemove(checks)') Удалить отмеченные
                        mdl-button.mdl-js-ripple-effect(v-if='isClosed', @click.native='removeClosed()') Показать скрытые
        mdl-dialog(ref='removeModal', title='Удаление записей')
            p
                | Вы действительно хотите удалить {{toRemove.length!==1?'выбранные записи':'выбранную запись'}}?
            div(slot='actions')
                mdl-button(@click.native='$refs.removeModal.close') Отменить
                mdl-button(primary='', @click.native='removeRows()') Удалить
        mdl-dialog(ref='editModal', :title="editingRow._id?'Редактирование записи':'Добавление записи'")
            form.editing-form(action='#')
                input(name='_id', v-model='editingRow._id', type='hidden')
                mdl-textfield.mdl-textfield--full-width(floating-label='в/ч', v-model='editingRow.obj')
                mdl-textfield.mdl-textfield--full-width(floating-label='дислокация', v-model='editingRow.place')
                mdl-select#editingRet.mdl-textfield--full-width(label='РЭТ', v-model='editingRow.ret', :options='retArray')
                mdl-textfield.mdl-textfield--full-width(floating-label='наличие пн', v-model='editingRow.pn')
                mdl-textfield.mdl-textfield--full-width(floating-label='тип РЭТ по штату', v-model='editingRow.type.req')
                mdl-textfield.mdl-textfield--full-width(floating-label='тип РЭТ в наличии', v-model='editingRow.type.real')
                mdl-textfield.mdl-textfield--full-width(floating-label='заводской номер', v-model='editingRow.serial')
                mdl-textfield.mdl-textfield--full-width(floating-label='год изготовления', v-model='editingRow.serial', type='number')
                .form-group
                    p вид и год последнего ремонта
                    .form-indent
                        mdl-select#editingRepairType.mdl-textfield--full-width(label='вид', v-model='editingRow.repair.type', :options='repairTypeArray')
                        mdl-textfield.mdl-textfield--full-width(floating-label='год', v-model='editingRow.repair.year', type='number')
                mdl-select#editingCondition.display-block(label='состояние РЭТ', v-model='editingRow.condition', :options='conditionArray')
                .form-group
                    p отв. за эксплуатацию, уход и сбережение
                    .form-indent
                        mdl-textfield.mdl-textfield--full-width(floating-label='воинское звание', v-model='editingRow.resp.rank')
                        mdl-textfield.mdl-textfield--full-width(floating-label='ФИО', v-model='editingRow.resp.fio')
                        mdl-textfield.mdl-textfield--full-width(floating-label='приказ о закреплении', v-model='editingRow.resp.order')
                .form-group
                    p установленный ресурс РЭТ
                    .form-indent
                        mdl-textfield.mdl-textfield--full-width(floating-label='ресурс до КР (час.)', v-model='editingRow.est.res.kr', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='ресурс до списания (час.)', v-model='editingRow.est.res.cancel', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='срок службы до КР (лет)', v-model='editingRow.est.life.kr', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='срок службы до списания (лет)', v-model='editingRow.est.life.cancel', type='number')
                .form-group
                    p наработка РЭТ
                    .form-indent
                        mdl-textfield.mdl-textfield--full-width(:floating-label="'наработка с начала эксплуатации на '+settings.startDate+' (час.)'", v-model='editingRow.elabor.elabor.total', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='наработка до КР (час.)', v-model='editingRow.elabor.elabor.before', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='наработка после КР (час.)', v-model='editingRow.elabor.elabor.after', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='отработано ВСЕГО (лет)', v-model='editingRow.elabor.dev.total', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='отработано до КР (лет)', v-model='editingRow.elabor.dev.before', type='number')
                        mdl-textfield.mdl-textfield--full-width(floating-label='отработано после КР (лет)', v-model='editingRow.elabor.dev.after', type='number')
                .form-group
                    p Запас ресурса образца РЭТ
                    .form-indent
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (лет)', :value='editingRow.stock.year.kr.num = editingRow.est.life.kr - editingRow.elabor.dev.before | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (%)', :value='editingRow.stock.year.kr.per = editingRow.elabor.dev.before/editingRow.est.life.kr*100 | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (лет)', :value='editingRow.stock.year.cancel.num = editingRow.est.life.cancel - editingRow.elabor.elabor.total | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (%)', :value='editingRow.stock.year.cancel.per = editingRow.elabor.elabor.total/editingRow.est.life.cancel*100 | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (час)', :value='editingRow.stock.hour.kr.num = editingRow.est.res.kr - editingRow.elabor.elabor.before | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до КР (%)', :value='editingRow.stock.hour.kr.per = editingRow.elabor.elabor.before/editingRow.est.res.kr*100 | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (час)', :value='editingRow.stock.hour.cancel.num = editingRow.est.res.cancel - editingRow.elabor.elabor.total | NaN | r2', type='number')
                        mdl-textfield.mdl-textfield--full-width(readonly='', floating-label='до списания (%)', :value='editingRow.stock.hour.cancel.per = editingRow.elabor.elabor.total/editingRow.est.life.cancel*100 | NaN | r2', type='number')
            div(slot='actions')
                mdl-button(@click.native='$refs.editModal.close') Отменить
                mdl-button(primary='', @click.native='saveRow()') Сохранить
        mdl-snackbar.mdl-snackbar_padding(display-on='msgSent')


</template>
<script>
    let Vue = require("vue/dist/vue.js");

    export default {
        props: {
            options: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data: function () {
            return Object.assign({
                rows: [],
                sel: JSON.parse(JSON.stringify(this.options.selSeed)),
                perPage: this.options.perPage || 10,
                page: 1,
                checks: [],
                checkAll: false,
                edit: -1,
                checkAllChanged: false,
                savedRow: null,
                editingRow: JSON.parse(JSON.stringify(this.options.rowSeed)),
                toRemove: [],

                tfConf: Object.assign({

                    filters_row_index: 2,
                    paging: {
                        length: 5,
                        toolbar_position: 'left',
                        page_text: 'стр',
                        of_text: ' из ',
                        target_id: 'paging'
                    },
                    clear_filter_text: " ",
                    locale: "ru",
                    refresh_filters: true,
                }, this.options.tfConf || {}),
                tf: null,
            }, this.options.data || {})
        },
        computed: Object.assign({
            isClosed: function () {
                return this.getSelCnt(this.sel) !== this.getSelCnt(this.options.selSeed)
            },
            maxPage: function () {
                return Math.ceil(this.rows.length / this.perPage) || 1;
            },
            selFooter: function () {
                return 4 + this.getSelCnt(this.options.selSeed) + 2;
            },
            copyRows: function () {
                return JSON.parse(JSON.stringify(this.rows));
            },
        }, this.options.computed || {}),
        methods: Object.assign({
            removeClosed: function () {
                this.sel = JSON.parse(JSON.stringify(this.options.selSeed));
                return true;
            },
            recValue: function (arr, val) {
                return recValue(arr, val);
            },
            getSelCnt: function (arr) {
                arr = JSON.parse(JSON.stringify(arr));
                let res = 0;
                for (let i in arr) {
                    if (isArray(arr[i]) || isObject(arr[i])) {
                        res += this.getSelCnt(arr[i]);
                    } else {
                        res += arr[i];
                    }
                }
                return res;
            },
            getName: function (arr, value) {
                if (!value) {
                    return "";
                }
                let items = arr.filter(function (item) {
                    return item.value == value;
                });
                if (items.length === 0) {
                    return "";
                }
                return items[0].name;
            },
            addRow: function (index) {
                try {
                    this.rows.splice(index + 1, 0, JSON.parse(JSON.stringify(this.options.rowSeed)));
                    this.edit = index;
                    setTimeout(()=> this.tf.Mod.paging.setPage('last'), 0);

                } catch (e) {
                    console.error(e);
                }
            },

            inquireRemove: function (input) {
                this.toRemove = input;
                this.$refs.removeModal.open();
            },
            removeRows: function () {
                let indexes = JSON.parse(JSON.stringify(this.toRemove));
                indexes.sort(compareNumbers).reverse();
                let ln = indexes.length;

                // Будем работать с буфером
                let rows = JSON.parse(JSON.stringify(this.rows));
                for (let i = 0; i < ln; i++) {

                    let index = indexes[i];
                    // Удаляем из базы
                    let id = this.rows[index]._id;
                    if (id) {
                        db.remove({table: this.options.table, _id: id});
                    }

                    // Удаляем чб, если был отмечен
                    let delCheck = this.checks.indexOf(index);
                    if (delCheck !== -1) {
                        this.checks.splice(delCheck, 1);
                    }

                    // Сдвигаем последующие чб вниз
                    for (let j = 0; j < this.checks.length; j++) {
                        if (this.checks[j] > index) {
                            Vue.set(this.checks, j, this.checks[j] - 1)
                        }
                    }

                    // Удаляем строку в буфере
                    rows.splice(index, 1);
                }

                // Переносим буфер в актуал
                this.rows = rows;
                this.toRemove = [];
                this.$refs.removeModal.close();
                this.$root.$emit('msgSent', {message: 'Удалено'});

                if(this.options.onRemove) {
                    $.proxy(this.options.onRemove,this)();
                }
            },
            initTf () {
                setTimeout(()=>{
                    this.tf = new TableFilter(this.$refs.table, this.tfConf,this.tfConf.filters_row_index);
                    this.tf.init();
                    console.log(this.tf);
                },0);
            },
            editRow: function (index) {
                if(this.rows[index]) {
                    this.editingRow = JSON.parse(JSON.stringify(this.rows[index]));
                    this.editingRow.index = index;
                } else {
                    this.editingRow = JSON.parse(JSON.stringify(this.options.rowSeed));
                }
                this.$refs.editModal.open();
            },
            cancelRow: function (index) {
                if (this.savedRow) {
                    Vue.set(this.rows, index, this.savedRow);
                } else {
                    this.rows.splice(index, 1);
                }
                if (this.page > this.maxPage) {
                    this.page = this.maxPage;
                }
                this.edit = -1;
                this.savedRow = null;
            },
            saveRow: function () {
                let item = this.editingRow;
                let index = this.editingRow.index;
                this.editingRow.index = undefined;
                if (!item._id) {
                    item._id = undefined;
                    console.log('insert');
                    if(this.options.insertRow) {
                        $.proxy(this.options.insertRow,this)(item);
                    } else {
                        db.insert(Object.assign({table: this.options.table}, item), $.proxy(function (err, newItem) {
                            item._id = newItem._id;
                            this.rows.push(item);
                            this.$root.$emit('msgSent', {message: 'Сохранено'});
                            this.$refs.editModal.close();
                            if (this.options.onInsert) {
                                $.proxy(this.options.onInsert, this)();
                            }
                        }, this));
                    }
                } else {
                    console.log('update');
                    if(this.options.updatetRow) {
                        $.proxy(this.options.updatetRow,this)(item);
                    } else {
                        db.update({table: this.options.table, _id: item._id}, {$set: item}, $.proxy(function (err, code) {
                            this.rows.splice(index,1,item);
                            this.$root.$emit('msgSent', {message: 'Сохранено'});
                            this.$refs.editModal.close();
                            if (this.options.onUpdate) {
                                $.proxy(this.options.onUpdate, this)();
                            }
                        }, this));
                    }
                }
                if(this.options.onSave) {
                    $.proxy(this.options.onSave,this)();
                }
                this.edit = -1;
            },
            toggleCheck: function () {
                // Кликнули по чб в строках
                let checkNum;
                if (this.rows.length < this.page * this.perPage) {
                    checkNum = this.rows.length - (this.page - 1) * this.perPage;
                } else {
                    checkNum = this.perPage;
                }

                this.checkAll = this.checks.length === checkNum;
            },
            toggleCheckAll: function () {
                // Кликнули по общему чб
                this.checks = [];
                if (this.checkAll) {
                    for (let i = (this.page - 1) * this.perPage; i < this.rows.length && i < this.page * this.perPage; i++) {
                        this.checks.push(i);
                    }
                }
            },
            setRows: function () {
                db.find({table: this.options.table}).sort({createdAt:1}).exec($.proxy(function (err, rows) {
                    this.rows = rows;
                    this.initTf();
                }, this));
            },
            paginating: function () {
                this.checks = [];
            }
        }, this.options.methods || {}),
        created: function () {
            if(this.options.init) {
                $.proxy(this.options.init,this)();
            } else {
                this.setRows();
            }
            this.watchCollection(['checks'], this.toggleCheck);
            // this.watchCollection(['page'], this.paginating);
            this.watchCollection(['copyRows'], (newVal,oldVal)=> {
                if(this.tf) {
                    let curPage = this.tf.Mod.paging.currentPageNb;
                    setTimeout(() => {
                        this.tf.refreshFilters();
                        this.tf.Mod.paging.destroy();
                        this.tf.Mod.paging.init();
                        setTimeout(() => {
                            if (oldVal.length < newVal.length || curPage > this.tf.Mod.paging.nbPages) {
                                console.log('last');
                                this.tf.Mod.paging.setPage('last');
                                // debugger;
                            } else {
                                console.log('cur',curPage);
                                this.tf.Mod.paging.setPage(curPage);
                            }
                        }, 0);
                    }, 0);
                }
            });

            if(this.options.created) {
                $.proxy(this.options.created,this)();
            }
        },
        mounted: function () {
            let $tCont = $('.table-container');

            $('body').on('keyup', $.proxy(function (e) {
                if (this.edit !== -1) {
                    if (e.keyCode === 13 && (e.target.type !== 'textarea' || e.ctrlKey || e.altKey)) {
                        this.saveRow(this.edit);
                        $('.ui-datepicker').hide();
                        return false;
                    }
                    if (e.keyCode === 27) {
                        this.cancelRow(this.edit);
                        $('.ui-datepicker').hide();
                        return false;
                    }
                }
            }, this));

            $(document).on('change','.tablesaw-columntoggle-popup input[type="checkbox"]', $.proxy(function(e, tablesaw) {
                $('.tablesaw-toggle-cellhidden').each($.proxy((i,th) => {
                    let model = th.getAttribute('data-sort');
                    eval('this.sel.' + model + ' = 0;');
                }, this))
            }, this));

            $tCont.on('click', '.sortable', $.proxy(function (e) {
                let $th = $(e.target);
                if (!$th.hasClass('sortable')) {
                    return false;
                }
                // let rows = JSON.parse(JSON.stringify(this.rows));
                let sort;
                if ($th.hasClass('mdl-data-table__header--sorted-ascending')) {
                    $th.removeClass('mdl-data-table__header--sorted-ascending');
                    $th.addClass('mdl-data-table__header--sorted-descending');
                    sort = {
                        model: $th.data('sort'),
                        type: $th.data('type'),
                        asc: false
                    };
                } else if ($th.hasClass('mdl-data-table__header--sorted-descending')) {
                    $th.removeClass('mdl-data-table__header--sorted-descending');
                    sort = {
                        model: 'createdAt',
                        type: '',
                        asc: true
                    };
                } else {
                    $('.mdl-data-table__header--sorted-ascending').removeClass('mdl-data-table__header--sorted-ascending');
                    $('.mdl-data-table__header--sorted-descending').removeClass('mdl-data-table__header--sorted-descending');
                    $th.addClass('mdl-data-table__header--sorted-ascending');
                    sort = {
                        model: $th.data('sort'),
                        type: $th.data('type'),
                        asc: true
                    };
                }
                let t = sort.asc ? 1 : -1;
                let f = t*-1;
                function compare(a, b) {
                    let a1 = getInObj(a, sort.model);
                    let b1 = getInObj(b, sort.model);
                    if (sort.type === 'date') {
                        a1 = moment(a1);
                        b1 = moment(b1);
                    } else if (sort.type === 'number') {
                        a1 = Number(a1);
                        b1 = Number(b1);
                    }
                    return a1 > b1 ? t : (a1===b1 ? 0 : f);
                }
                this.rows.sort(compare);
            }, this));

            if(this.options.mounted) {
                $.proxy(this.options.mounted,this)();
            }
        },
    }
</script>
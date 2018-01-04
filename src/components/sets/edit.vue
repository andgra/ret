<template lang="pug">
    div.table-container
        EditedTable(:options="options",:rows="rows")
        //-
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
    //    import EditedTable from '../mixins/edited-table';
    import EditedTable from '../common/EditedTable.vue';

    let struct =
        [
            {id: "obj", title: "в/ч", type: String, default: ""},
            {id: "place", title: "дислокация", type: String, default: ""},
            {id: "ret", title: "РЭТ", type: String, default: ""},
            {id: "pn", title: "Наличие<br>ПН", type: String, default: ""},
            {
                id: "type", title: "", children:
                [
                    {id: "req", title: "Тип РЭТ<br>по штату", type: String, default: ""},
                    {id: "real", title: "Тип РЭТ<br>в наличии", type: String, default: ""},
                ]
            },
            {id: "serial", title: "Заводской<br>номер", type: String, default: ""},
            {id: "year", title: "Год<br>изготовления", type: Number, default: 0},
            {
                id: "repair", title: "Вид и год последнего ремонта", children:
                [
                    {id: "type", title: "Вид", type: String, default: ""},
                    {id: "year", title: "Год", type: Number, default: 0},
                ]
            },
            {id: "condition", title: "Состояние РЭТ", type: String, default: ""},
            {
                id: "resp", title: "Отв. за эксплуатацию, уход и сбережение", children:
                [
                    {id: "rank", title: "В/зв", type: String, default: ""},
                    {id: "fio", title: "Ф.И.О.", type: String, default: ""},
                    {id: "order", title: "Пр. о закреплении", type: String, default: ""},
                ]
            },
            {
                id: "est", title: "Установленный ресурс РЭТ", children:
                [
                    {
                        id: "res", title: "", children:
                        [
                            {id: "kr", title: "ресурс до<br>КР (час.)", type: Number, default: 0},
                            {id: "cancel", title: "ресурс до<br>списания (час.)", type: Number, default: 0},
                        ]
                    },
                    {
                        id: "life", title: "", children:
                        [
                            {id: "kr", title: "срок службы<br>до КР (лет)", type: Number, default: 0},
                            {id: "cancel", title: "срок службы<br>до списания (лет)", type: Number, default: 0},
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
                            {id: "total", title: "наработка с начала<br>эксплуатации на<br>01.07.17 (час.)", type: Number, default: 0},
                            {id: "before", title: "наработка до<br>КР (час.)", type: Number, default: 0},
                            {id: "after", title: "наработка после<br>КР (час.)", type: Number, default: 0},
                        ]
                    },
                    {
                        id: "dev", title: "", children:
                        [
                            {id: "total", title: "отработано<br>ВСЕГО (лет)", type: Number, default: 0},
                            {id: "before", title: "отработано<br>до КР (лет)", type: Number, default: 0},
                            {id: "after", title: "отработано<br>после КР (лет)", type: Number, default: 0},
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
                                    {id: "num", title: "лет", type: String, default: ""},
                                    {id: "per", title: "%", type: String, default: ""},
                                ]
                            },
                            {
                                id: "cancel", title: "Запас ресурса до списания", children:
                                [
                                    {id: "num", title: "лет", type: String, default: ""},
                                    {id: "per", title: "%", type: String, default: ""},
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
                                    {id: "num", title: "час", type: String, default: ""},
                                    {id: "per", title: "%", type: String, default: ""},
                                ]
                            },
                            {
                                id: "cancel", title: "Запас ресурса до списания", children:
                                [
                                    {id: "num", title: "час", type: String, default: ""},
                                    {id: "per", title: "%", type: String, default: ""},
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
        data: {
            perPage: 7,
            settings: {},
            retArray: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}],
            repairTypeArray: [{name: 'КР', value: 'kr'}, {name: 'РТС', value: 'rts'}],
            conditionArray: [{name: 'Свернуто', value: 'closed'}, {name: 'Находится в эксплуатации', value: 'in_prod'}],
        },
        tfConf: {
            filters_row_index: 4,
            col_0: "none",
            col_1: "none",
            col_2: "none",
            col_4: "select",
            col_6: "select",
            col_7: "select",
            col_8: "select",
            col_9: "select",
            col_12: "select",
            col_14: "select",
            col_38: "none",
            col_39: "none",
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
            console.log(this)
            db.find({
                table: 'sets', $where: function () {
                    if (!filter || !filter.startDate)
                        return true;
                    return moment(this.createdAt) > moment(filter.startDate, "DD.MM.YYYY");
                }
            }).sort({createdAt: 1}).exec($.proxy(function (err, rows) {
                console.log(rows);
                console.log(this)
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
        components: {EditedTable}
    };

    export default vm;
</script>

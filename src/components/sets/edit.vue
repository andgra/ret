<template>
    <div class="table-container">

        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table" data-tablesaw-mode="columntoggle" ref="table" id="table">
            <thead>
            <tr data-tablesaw-ignorerow><th :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                <h4>Таблица сводных данных</h4>
            </th></tr>
            <tr class="center-all" data-tablesaw-ignorerow>
                <th :colspan="selFirstFirst"></th>
                <th :colspan="getSelCnt(sel.stock)" v-if="getSelCnt(sel.stock)">Запас ресурса образца РЭТ</th>
                <th :colspan="selFirstLast"></th>
            </tr>
            <tr class="center-all" data-tablesaw-ignorerow>
                <th :colspan="selSecondFirst"></th>
                <th :colspan="getSelCnt(sel.repair)" v-if="getSelCnt(sel.repair)">Вид и год последнего ремонта</th>
                <th v-if="sel.condition"></th>
                <th :colspan="getSelCnt(sel.resp)" v-if="getSelCnt(sel.resp)">Отв. за эксплуатацию, уход и сбережение</th>
                <th :colspan="getSelCnt(sel.est)" v-if="getSelCnt(sel.est)">Установленный ресурс РЭТ</th>
                <th :colspan="getSelCnt(sel.elabor)" v-if="getSelCnt(sel.elabor)">Наработка РЭТ</th>
                <th :colspan="getSelCnt(sel.stock.year.kr)" v-if="getSelCnt(sel.stock.year.kr)">Запас ресурса до КР</th>
                <th :colspan="getSelCnt(sel.stock.year.cancel)" v-if="getSelCnt(sel.stock.year.cancel)">Запас ресурса до списания</th>
                <th :colspan="getSelCnt(sel.stock.hour.kr)" v-if="getSelCnt(sel.stock.hour.kr)">Запас ресурса до КР</th>
                <th :colspan="getSelCnt(sel.stock.hour.cancel)" v-if="getSelCnt(sel.stock.hour.cancel)">Запас ресурса до списания</th>
                <th :colspan="selFirstLast"></th>
            </tr>
            <tr class="center-all wide-all">
                <th class="mdl-th-padding"><mdl-checkbox v-model="checkAll" @change.native="toggleCheckAll" id="checkAll" :disabled="edit!==-1"></mdl-checkbox></th>
                <th colspan="2">Действия</th>
                <th scope="col">№</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="obj">в/ч</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="place">дислокация</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="ret">РЭТ</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="pn">Наличие<br>ПН</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="type.req">Тип РЭТ<br>по штату</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="type.real">Тип РЭТ<br>в наличии</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="serial">Заводской<br>номер</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="year" data-type="number">Год<br>изготовления</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="repair.type">Вид</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="repair.year" data-type="number">Год</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="condition">Состояние РЭТ</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="resp.rank">В/зв</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="resp.fio">Ф.И.О.</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="resp.order">Пр. о закреплении</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="est.res.kr" data-type="number">ресурс до<br>КР (час.)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="est.res.cancel" data-type="number">ресурс до<br>списания (час.)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="est.life.kr" data-type="number">срок службы до<br>КР (лет)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="est.life.cancel" data-type="number">срок службы до<br>списания (лет)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="elabor.elabor.total" data-type="number">наработка с начала<br>эксплуатации на<!--01.07.17--><br>
                    <DatePicker id="startDate"
                                :value="settings.startDate ? settings.startDate : '01.01.2017'"
                                :onSelect="startDateSelect"
                                :isButton="true"
                    ></DatePicker>
                    <!--<mdl-button style="width: 90px"></mdl-button>-->
                     (час.)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="elabor.elabor.before" data-type="number">наработка<br>до КР (час.)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="elabor.elabor.after" data-type="number">наработка<br>после КР (час.)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="elabor.dev.total" data-type="number">отработано<br>ВСЕГО (лет)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="elabor.dev.before" data-type="number">отработано<br>до КР (лет)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="elabor.dev.after" data-type="number">отработано<br>после КР (лет)</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.year.kr.num" data-type="number">лет</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.year.kr.per" data-type="number">%</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.year.cancel.num" data-type="number">лет</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.year.cancel.per" data-type="number">%</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.hour.kr.num" data-type="number">час</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.hour.kr.per" data-type="number">%</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.hour.cancel.num" data-type="number">час</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="stock.hour.cancel.per" data-type="number">%</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="createdAt">Создан</th>
                <th scope="col" class="sortable" data-tablesaw-priority="1" data-sort="updatedAt">Изменен</th>
                <th colspan="2">Действия</th>
            </tr>
            </thead>
            <tbody><!-- v-if="index>=(page-1)*perPage && index<page*perPage"-->
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index">
                <td>
                    <mdl-checkbox v-model="checks" :val="index" :disabled="edit!==-1"></mdl-checkbox>
                </td>
                <td @click="editRow(index)" class="clickable tooltip" data-tooltip="Редактировать"><i class="fa fa-pencil"></i></td>
                <td @click="inquireRemove([index])" class="clickable tooltip" data-tooltip="Удалить"><i class="fa fa-times"></i></td>
                <td>
                    {{index+1}}
                    <input name="_id" v-model="row._id" type="hidden"/>
                </td>
                <td v-if="sel.obj" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.obj}}</label>
                </td>
                <td v-if="sel.place" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.place}}</label>
                </td>
                <td v-if="sel.ret" class="mdl-data-table__cell--non-numeric">
                    <label>{{getName(retArray,row.ret)}}</label>
                </td>
                <td v-if="sel.pn" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.pn}}</label>
                </td>
                <td v-if="sel.type.req" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.type.req}}</label>
                </td>
                <td v-if="sel.type.real" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.type.real}}</label>
                </td>
                <td v-if="sel.serial" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.serial}}</label>
                </td>
                <td v-if="sel.year">
                    <label>{{row.year}}</label>
                </td>
                <td v-if="sel.repair.type" class="mdl-data-table__cell--non-numeric">
                    <label>{{getName(repairTypeArray, row.repair.type)}}</label>
                </td>
                <td v-if="sel.repair.year">
                    <label>{{row.repair.year}}</label>
                </td>
                <td v-if="sel.condition" class="mdl-data-table__cell--non-numeric">
                    <label>{{getName(conditionArray, row.condition)}}</label>
                </td>
                <td v-if="sel.resp.rank" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.resp.rank}}</label>
                </td>
                <td v-if="sel.resp.fio" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.resp.fio}}</label>
                </td>
                <td v-if="sel.resp.order" class="mdl-data-table__cell--non-numeric">
                    <label>{{row.resp.order}}</label>
                </td>
                <td v-if="sel.est.res.kr">
                    <label>{{row.est.res.kr}}</label>
                </td>
                <td v-if="sel.est.res.cancel">
                    <label>{{row.est.res.cancel}}</label>
                </td>
                <td v-if="sel.est.life.kr">
                    <label>{{row.est.life.kr}}</label>
                </td>
                <td v-if="sel.est.life.cancel">
                    <label>{{row.est.life.cancel}}</label>
                </td>
                <td v-if="sel.elabor.elabor.total">
                    <label>{{row.elabor.elabor.total}}</label>
                </td>
                <td v-if="sel.elabor.elabor.before">
                    <label>{{row.elabor.elabor.before}}</label>
                </td>
                <td v-if="sel.elabor.elabor.after">
                    <label>{{row.elabor.elabor.after}}</label>
                </td>
                <td v-if="sel.elabor.dev.total">
                    <label>{{row.elabor.dev.total}}</label>
                </td>
                <td v-if="sel.elabor.dev.before">
                    <label>{{row.elabor.dev.before}}</label>
                </td>
                <td v-if="sel.elabor.dev.after">
                    <label>{{row.elabor.dev.after}}</label>
                </td>
                <td v-if="sel.stock.year.kr.num">{{row.stock.year.kr.num = row.est.life.kr - row.elabor.dev.before | NaN | r2}}</td>
                <td v-if="sel.stock.year.kr.per">{{row.stock.year.kr.per = row.elabor.dev.before/row.est.life.kr*100 | NaN | r2}}</td>
                <td v-if="sel.stock.year.cancel.num">{{row.stock.year.cancel.num = row.est.life.cancel - row.elabor.elabor.total | NaN | r2}}</td>
                <td v-if="sel.stock.year.cancel.per">{{row.stock.year.cancel.per = row.elabor.elabor.total/row.est.life.cancel*100 | NaN | r2}}</td>
                <td v-if="sel.stock.hour.kr.num">{{row.stock.hour.kr.num = row.est.res.kr - row.elabor.elabor.before | NaN | r2}}</td>
                <td v-if="sel.stock.hour.kr.per">{{row.stock.hour.kr.per = row.elabor.elabor.before/row.est.res.kr*100 | NaN | r2}}</td>
                <td v-if="sel.stock.hour.cancel.num">{{row.stock.hour.cancel.num = row.est.res.cancel - row.elabor.elabor.total | NaN | r2}}</td>
                <td v-if="sel.stock.hour.cancel.per">{{row.stock.hour.cancel.per = row.elabor.elabor.total/row.est.life.cancel*100 | NaN | r2}}</td>
                <td v-if="sel.createdAt" class="mdl-data-table__cell--non-numeric">{{row.createdAt | myDateTime}}</td>
                <td v-if="sel.updatedAt" class="mdl-data-table__cell--non-numeric">{{row.updatedAt | myDateTime}}</td>

                <td v-if="edit===-1" @click="editRow(index)" class="clickable tooltip" data-tooltip="Редактировать">
                    <i class="fa fa-pencil"></i>
                </td>
                <td v-else-if="edit===index" @click="saveRow(index)" class="clickable tooltip" data-tooltip="Сохранить">
                    <i class="fa fa-floppy-o"></i>
                </td>
                <td v-else></td>
                <td v-if="edit===-1" @click="inquireRemove([index])" class="clickable tooltip" data-tooltip="Удалить">
                    <i class="fa fa-times"></i>
                </td>
                <td v-else-if="edit===index" @click="cancelRow(index)" class="clickable tooltip" data-tooltip="Отменить редактирвоание">
                    <i class="fa fa-undo"></i>
                </td>
                <td v-else></td>
            </tr>
            </tbody>
            <tfoot>

            <tr>
                <td :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                    <div id="paging">

                    </div>
                </td>
            </tr>
            <tr>
                <td :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                    <mdl-button class="mdl-js-ripple-effect" :disabled="edit!==-1" @click.native="addRow(rows.length)">Добавить запись</mdl-button>
                    <mdl-button class="mdl-js-ripple-effect" :disabled="edit!==-1 || checks.length===0" @click.native="inquireRemove(checks)">Удалить отмеченные</mdl-button>
                    <mdl-button class="mdl-js-ripple-effect" v-if="isClosed" @click.native="removeClosed()">Показать скрытые</mdl-button>
                </td>
            </tr>
            </tfoot>
        </table>
        <mdl-dialog ref="removeModal" title="Удаление записей">

            <p>Вы действительно хотите удалить {{toRemove.length!==1?'выбранные записи':'выбранную запись'}}?</p>
            <div slot="actions">
                <mdl-button @click.native="$refs.removeModal.close">Отменить</mdl-button>
                <mdl-button primary @click.native="removeRows()">Удалить</mdl-button>
            </div>
        </mdl-dialog>
        <mdl-dialog ref="editModal" :title="editingRow._id?'Редактирование записи':'Добавление записи'">
            <form action="#" class="editing-form">
                <input name="_id" v-model="editingRow._id" type="hidden"/>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="в/ч" v-model="editingRow.obj"></mdl-textfield>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="дислокация" v-model="editingRow.place"></mdl-textfield>
                <mdl-select class="mdl-textfield--full-width" label="РЭТ" v-model="editingRow.ret" :options="retArray" id="editingRet"></mdl-select>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="наличие пн" v-model="editingRow.pn"></mdl-textfield>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="тип РЭТ по штату" v-model="editingRow.type.req"></mdl-textfield>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="тип РЭТ в наличии" v-model="editingRow.type.real"></mdl-textfield>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="заводской номер" v-model="editingRow.serial"></mdl-textfield>
                <mdl-textfield class="mdl-textfield--full-width" floating-label="год изготовления" v-model="editingRow.serial" type="number"></mdl-textfield>
                <div class="form-group">
                    <p>вид и год последнего ремонта</p>
                    <div class="form-indent">
                        <mdl-select class="mdl-textfield--full-width" label="вид" v-model="editingRow.repair.type" :options="repairTypeArray" id="editingRepairType"></mdl-select>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="год" v-model="editingRow.repair.year" type="number"></mdl-textfield>
                    </div>
                </div>
                <mdl-select class="display-block" label="состояние РЭТ" v-model="editingRow.condition" :options="conditionArray" id="editingCondition"></mdl-select>
                <div class="form-group">
                    <p>отв. за эксплуатацию, уход и сбережение</p>
                    <div class="form-indent">
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="воинское звание" v-model="editingRow.resp.rank"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="ФИО" v-model="editingRow.resp.fio"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="приказ о закреплении" v-model="editingRow.resp.order"></mdl-textfield>
                    </div>
                </div>
                <div class="form-group">
                    <p>установленный ресурс РЭТ</p>
                    <div class="form-indent">
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="ресурс до КР (час.)" v-model="editingRow.est.res.kr" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="ресурс до списания (час.)" v-model="editingRow.est.res.cancel" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="срок службы до КР (лет)" v-model="editingRow.est.life.kr" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="срок службы до списания (лет)" v-model="editingRow.est.life.cancel" type="number"></mdl-textfield>
                    </div>
                </div>
                <div class="form-group">
                    <p>наработка РЭТ</p>
                    <div class="form-indent">
                        <mdl-textfield class="mdl-textfield--full-width" :floating-label="'наработка с начала эксплуатации на '+settings.startDate+' (час.)'" v-model="editingRow.elabor.elabor.total" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="наработка до КР (час.)" v-model="editingRow.elabor.elabor.before" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="наработка после КР (час.)" v-model="editingRow.elabor.elabor.after" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="отработано ВСЕГО (лет)" v-model="editingRow.elabor.dev.total" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="отработано до КР (лет)" v-model="editingRow.elabor.dev.before" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="отработано после КР (лет)" v-model="editingRow.elabor.dev.after" type="number"></mdl-textfield>
                    </div>
                </div>
                <div class="form-group">
                    <p>Запас ресурса образца РЭТ</p>
                    <div class="form-indent">
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до КР (лет)" :value="editingRow.stock.year.kr.num = editingRow.est.life.kr - editingRow.elabor.dev.before | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до КР (%)" :value="editingRow.stock.year.kr.per = editingRow.elabor.dev.before/editingRow.est.life.kr*100 | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до списания (лет)" :value="editingRow.stock.year.cancel.num = editingRow.est.life.cancel - editingRow.elabor.elabor.total | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до списания (%)" :value="editingRow.stock.year.cancel.per = editingRow.elabor.elabor.total/editingRow.est.life.cancel*100 | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до КР (час)" :value="editingRow.stock.hour.kr.num = editingRow.est.res.kr - editingRow.elabor.elabor.before | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до КР (%)" :value="editingRow.stock.hour.kr.per = editingRow.elabor.elabor.before/editingRow.est.res.kr*100 | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до списания (час)" :value="editingRow.stock.hour.cancel.num = editingRow.est.res.cancel - editingRow.elabor.elabor.total | NaN | r2" type="number"></mdl-textfield>
                        <mdl-textfield class="mdl-textfield--full-width" readonly floating-label="до списания (%)" :value="editingRow.stock.hour.cancel.per = editingRow.elabor.elabor.total/editingRow.est.life.cancel*100 | NaN | r2" type="number"></mdl-textfield>
                    </div>
                </div>
            </form>


            <div slot="actions">
                <mdl-button @click.native="$refs.editModal.close">Отменить</mdl-button>
                <mdl-button primary @click.native="saveRow()">Сохранить</mdl-button>
            </div>
        </mdl-dialog>
        <mdl-snackbar display-on="msgSent" class="mdl-snackbar_padding"></mdl-snackbar>
    </div>

</template>

<script>
    import EditedTable from '../mixins/edited-table';

    let rowSeed = {
        _id: "",
        obj: "",
        place: "",
        ret: "",
        pn: "",
        type: {
            req: "",
            real: ""
        },
        serial: "",
        year: 0,
        repair: {
            type: "",
            year: 0
        },
        condition: "",
        resp: {
            rank: "",
            fio: "",
            order: "",
        },
        est: {
            res: {
                kr: 0,
                cancel: 0,
            },
            life: {
                kr: 0,
                cancel: 0,
            }
        },
        elabor: {
            elabor: {
                total: 0,
                before: 0,
                after: 0,
            },
            dev: {
                total: 0,
                before: 0,
                after: 0,
            }
        },
        stock: {
            year: {
                kr: {
                    num: "",
                    per: "",
                },
                cancel: {
                    num: "",
                    per: "",
                }
            },
            hour: {
                kr: {
                    num: "",
                    per: "",
                },
                cancel: {
                    num: "",
                    per: "",
                }
            },
        },
    };
    let selSeed = recValue(rowSeed, 1);
    selSeed._id = null;
    selSeed.createdAt = 1;
    selSeed.updatedAt = 1;

    let vm = EditedTable({
        rowSeed,
        selSeed,
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
        computed: {
            selSecondFirst: function() {
                return 4+this.sel.obj+this.sel.place+this.sel.ret+this.sel.pn+
                    this.sel.type.req+this.sel.type.real+this.sel.serial+this.sel.year;
            },
            selFirstFirst: function() {
                return this.selSecondFirst+this.getSelCnt(this.sel.repair)+
                    this.sel.condition+this.getSelCnt(this.sel.resp)+
                    this.getSelCnt(this.sel.est)+this.getSelCnt(this.sel.elabor);
            },
            selFirstLast: function() {
                console.log(2+this.sel.createdAt+this.sel.updatedAt);
                return 2+this.sel.createdAt+this.sel.updatedAt;
            }
        },
        methods: {
            setRows: function(filter) {
                db.find({table: 'sets', $where: function () {
                    if(!filter.startDate)
                        return true;
                    return moment(this.createdAt) > moment(filter.startDate, "DD.MM.YYYY");
                }}).sort({createdAt:1}).exec($.proxy(function (err, rows) {
                    this.rows = rows;
                    this.initTf();
                }, this));
            },
            startDateSelect: function(newVal) {
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
            }
        },
        mounted: function() {
            db.find({table: 'settings'}).exec($.proxy(function (err, rows) {
                let $startDate = $('#startDate');
                for(let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    if(row.key==='startDate') {
                        if($startDate.next('button').button( "option", "label")) {
                            $startDate.val(row.value);
                            $startDate.next('button').button( "option", "label", row.value );
                        }
                        this.settings.startDate = row.value;
                    }
                }
                this.setRows({startDate: this.settings.startDate})
            }, this));
        },
        init: function() {

        },
    });

    export default vm;
</script>

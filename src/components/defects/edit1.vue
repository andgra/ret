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
                <th class="mdl-data-table__cell--non-numeric">в/ч 55555</th>
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
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table">
            <thead>
            <tr class="center-all wide-all">
                <th class="mdl-th-padding">
                    <mdl-checkbox v-model="checkAll" @change.native="toggleCheckAll" id="checkAll"
                                  :disabled="edit!==-1"></mdl-checkbox>
                </th>
                <th colspan="2">Действия</th>
                <th>№</th>
                <th class="sortable" v-if="sel.obj" data-sort="obj">в/ч <i class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.place" data-sort="place">в/ч,<br>подразделение <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.ret" data-sort="ret">РЭТ <i class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.type" data-sort="type">Тип РЭТ <i class="fa fa-times close-coll"></i>
                </th>
                <th class="sortable" v-if="sel.zav" data-sort="zav">зав. № <i class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.failure" data-sort="failure" data-type="date">Дата и время<br>отказа <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.faulty" data-sort="faulty">Неисправная<br>система <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.measures" data-sort="measures">Принимаемые меры <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.recovery" data-sort="recovery" data-type="date">Дата и время<br>восстановления <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.zip" data-sort="zip">Время доставки<br>ЗИП <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.createdAt" data-sort="createdAt">Создан <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.updatedAt" data-sort="updatedAt">Изменен <i
                        class="fa fa-times close-coll"></i></th>
                <th colspan="2">Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" v-if="index>=(page-1)*perPage && index<page*perPage"
                :data-id="index">
                <td>
                    <mdl-checkbox v-model="checks" :val="index" :disabled="edit!==-1"></mdl-checkbox>
                </td>
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
                <td v-else-if="edit===index" @click="cancelRow(index)" class="clickable tooltip"
                    data-tooltip="Отменить редактирвоание">
                    <i class="fa fa-undo"></i>
                </td>
                <td v-else></td>
                <td>
                    {{index + 1}}
                    <input name="_id" v-model="row._id" type="hidden"/>
                </td>
                <td v-if="sel.obj" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.obj" v-if="edit===index" style="width: 100px;"></mdl-textfield>
                    <label v-else>{{row.obj}}</label>
                </td>
                <td v-if="sel.place" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.place" v-if="edit===index"
                                   style="width: 100px;"></mdl-textfield>
                    <label v-else>{{row.place}}</label>
                </td>
                <td v-if="sel.ret" class="mdl-data-table__cell--non-numeric">
                    <mdl-select label="" v-model="row.ret" v-if="edit===index" :options="retArray" :id="'ret'+index" style="width: 100px;"></mdl-select>
                    <label v-else>{{getName(retArray, row.ret)}}</label>
                </td>
                <td v-if="sel.type" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.type" v-if="edit===index"
                                   style="width: 70px;"></mdl-textfield>
                    <label v-else>{{row.type}}</label>
                </td>
                <td v-if="sel.zav" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.zav" v-if="edit===index"
                                   style="width: 120px;"></mdl-textfield>
                    <label v-else>{{row.zav}}</label>
                </td>
                <td v-if="sel.failure" class="mdl-data-table__cell--non-numeric">
                    <DateTimePicker v-model="row.failure" v-if="edit===index"></DateTimePicker>
                    <label v-else>{{row.failure | myDateTime}}</label>
                </td>
                <td v-if="sel.faulty" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.faulty" v-if="edit===index"
                                   style="width: 200px;"></mdl-textfield>
                    <label v-else>{{row.faulty}}</label>
                </td>
                <td v-if="sel.measures" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.measures" v-if="edit===index"
                                   :textarea="true" rows="4" style="width: 200px;"></mdl-textfield>
                    <label v-else class="textarea-output">{{row.measures}}</label>
                </td>
                <td v-if="sel.recovery" class="mdl-data-table__cell--non-numeric">
                    <DateTimePicker v-model="row.recovery" v-if="edit===index"></DateTimePicker>
                    <label v-else>{{row.recovery | myDateTime}}</label>
                </td>
                <td v-if="sel.zip" class="mdl-data-table__cell--non-numeric">
                    <IntervalPicker v-model="row.zip" :edit="edit===index" :outControl="true"></IntervalPicker>
                </td>
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
                <td v-else-if="edit===index" @click="cancelRow(index)" class="clickable tooltip"
                    data-tooltip="Отменить редактирвоание">
                    <i class="fa fa-undo"></i>
                </td>
                <td v-else></td>
            </tr>
            </tbody>
            <tfoot>

            <tr>
                <td :colspan="selFooter" class="mdl-data-table__cell--non-numeric pages">
                    <div v-if="maxPage<=7">
                        <span v-for="p in maxPage" @click="page=p" :class="{ active: page==p }">
                            {{p}}
                        </span>
                    </div>
                    <div v-else>
                        <div v-if="page<5">
                            <span v-for="p in (1, page+2)" @click="page=p" :class="{ active: page==p }">
                                {{p}}
                            </span>
                        </div>
                        <div v-else>
                            <span @click="page=1" :class="{ active: page==1 }">
                                {{1}}
                            </span>
                        </div>
                        <div v-if="page>=5 && page<=maxPage-4">
                            ...
                            <span v-for="p in maxPage" v-if="p>=3 && p<=maxPage-2 && p>page-3 && p<page+3"
                                  @click="page=p" :class="{ active: page==p }">
                                {{p}}
                            </span>
                        </div>
                        ...
                        <div v-if="page>maxPage-4">
                            <span v-for="p in maxPage" v-if="p>maxPage-6 && p+3>page" @click="page=p"
                                  :class="{ active: page==p }">
                                {{p}}
                            </span>
                        </div>
                        <div v-else>
                            <span @click="page=maxPage" :class="{ active: page==maxPage }">
                                {{maxPage}}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                    <mdl-button class="mdl-js-ripple-effect" :disabled="edit!==-1" @click.native="addRow(rows.length)">
                        Добавить запись
                    </mdl-button>
                    <mdl-button class="mdl-js-ripple-effect" :disabled="edit!==-1 || checks.length===0"
                                @click.native="inquireRemove(checks)">Удалить отмеченные
                    </mdl-button>
                    <mdl-button class="mdl-js-ripple-effect" v-if="isClosed" @click.native="removeClosed()">
                        Показать скрытые
                    </mdl-button>
                </td>
            </tr>
            </tfoot>
        </table>
        <mdl-dialog ref="removeModal" title="Удаление записей">

            <p>Вы действительно хотите удалить {{toRemove.length !== 1 ? 'выбранные записи' : 'выбранную запись'}}?</p>
            <div slot="actions">
                <mdl-button @click.native="$refs.removeModal.close">Отменить</mdl-button>
                <mdl-button primary @click.native="removeRows()">Удалить</mdl-button>
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
        type: "",
        zav: "",
        failure: moment(),
        faulty: "",
        measures: "",
        recovery: "",
        zip: 0,
    };
    let selSeed = recValue(rowSeed, 1);
    selSeed.createdAt = 1;
    selSeed.updatedAt = 1;

    let vm = EditedTable({
        rowSeed,
        selSeed,
        table: 'ret',
        data: {
            retArray: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}],
            statAsu0: 0,
            statAsu1: 0,
            statRls0: 0,
            statRls1: 0,

        },
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
            getInterval: function (d1, d2) {
                d1 = moment(d1);
                d2 = moment(d2);
                return d1.diff(d2, 'minutes');
            },
            updateStat: function () {
                if (this.edit === -1) {
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
                }
            }
        },
        created: function (self) {
            self.watchCollection(['edit', 'rows'], self.updateStat, {deep: true});
        },
    });

    export default vm;
</script>

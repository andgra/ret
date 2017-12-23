<template>
    <div class="table-container">
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table">
            <thead>
            <tr><th :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                <h4>Таблица контроля работ представителя промышленности</h4>
            </th></tr>
            <tr class="center-all wide-all">
                <th class="mdl-th-padding">
                    <mdl-checkbox v-model="checkAll" @change.native="toggleCheckAll" id="checkAll"
                                  :disabled="edit!==-1"></mdl-checkbox>
                </th>
                <th colspan="2">Действия</th>
                <th>№</th>
                <th class="sortable" v-if="sel.place" data-sort="place">в/ч,<br>подразделение <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.type" data-sort="type">Тип РЭТ <i class="fa fa-times close-coll"></i>
                </th>
                <th class="sortable" v-if="sel.zav" data-sort="zav">зав. № <i class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.arrival" data-sort="arrival" data-type="date">Дата<br>прибытия <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.title" data-sort="title">Наименование работ,<br>обслуживаемая система<br>ВВСТ <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.factory" data-sort="factory">Предприятие<br>промышленности <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.people" data-sort="people" data-type="number">Кол-во<br>чел. <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.senior" data-sort="senior">Старший бригады<br>ФИО, моб. тел. <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.envoy" data-sort="envoy">Представитель от<br>в/ч (подразделения) <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.departure" data-sort="departure" data-type="date">Дата<br>убытия <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.createdAt" data-sort="createdAt" data-type="date">Создан <i
                        class="fa fa-times close-coll"></i></th>
                <th class="sortable" v-if="sel.updatedAt" data-sort="updatedAt" data-type="date">Изменен <i
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
                <td v-if="sel.place" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.place" v-if="edit===index"
                                   style="width: 100px;"></mdl-textfield>
                    <label v-else>{{row.place}}</label>
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
                <td v-if="sel.arrival" class="mdl-data-table__cell--non-numeric">
                    <DatePicker v-model="row.arrival" v-if="edit===index"></DatePicker>
                    <label v-else>{{row.arrival}}</label>
                </td>
                <td v-if="sel.title" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.title" v-if="edit===index"
                                   :textarea="true" rows="4" style="width: 200px;"></mdl-textfield>
                    <label v-else class="textarea-output">{{row.title}}</label>
                </td>
                <td v-if="sel.factory" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.factory" v-if="edit===index"
                                   style="width: 150px;"></mdl-textfield>
                    <label v-else>{{row.factory}}</label>
                </td>
                <td v-if="sel.people">
                    <mdl-textfield label=" " v-model="row.people" type="number" v-if="edit===index"
                                   style="width: 50px;"></mdl-textfield>
                    <label v-else>{{row.people}}</label>
                </td>
                <td v-if="sel.senior" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.senior" v-if="edit===index"
                                   :textarea="true" rows="2" style="width: 150px;"></mdl-textfield>
                    <label v-else class="textarea-output">{{row.senior}}</label>
                </td>
                <td v-if="sel.envoy" class="mdl-data-table__cell--non-numeric">
                    <mdl-textfield label=" " v-model="row.envoy" v-if="edit===index" style="width: 150px;"></mdl-textfield>
                    <label v-else>{{row.envoy}}</label>
                </td>
                <td v-if="sel.departure" class="mdl-data-table__cell--non-numeric">
                    <DatePicker v-model="row.departure" v-if="edit===index"></DatePicker>
                    <label v-else>{{row.departure}}</label>
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
        place: "",
        type: "",
        zav: "",
        arrival: moment().format('DD.MM.YYYY'),
        title: "",
        factory: "",
        people: 0,
        senior: "",
        envoy: "",
        departure: "",
    };
    let selSeed = recValue(rowSeed, 1);
    selSeed.createdAt = 1;
    selSeed.updatedAt = 1;

    let vm = EditedTable({
        rowSeed,
        selSeed,
        table: 'works'
    });

    export default vm;
</script>

<template lang="pug">
    div.table-container
        table#table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp.border-all-cells.edited-table(data-tablesaw-mode='columntoggle', ref='table')
            thead
                tr(data-tablesaw-ignorerow='')
                    th.mdl-data-table__cell--non-numeric(:colspan='selFooter')
                        h4 {{options.title}}
                //- добавочные заголовки
                tr.center-all(v-for="(row,j) in grid", v-if="j<grid.length-1", data-tablesaw-ignorerow="")
                    th(v-for="(cell,i) in row", :colspan="cell.colspan", v-html="cell.title")
                //- контрольные заголовки
                tr.center-all.wide-all
                    th.mdl-th-padding
                        mdl-checkbox#checkAll(v-model='checkAll', @change.native='toggleCheckAll', :disabled='edit!==-1')
                    th(colspan='2') Действия
                    th(scope='col') №
                    th.sortable(v-for="(cell,i) in grid[grid.length-1]", :colspan="cell.colspan", v-html="cell.title",
                    scope='col', data-tablesaw-priority='1', :data-sort="cell.id",
                    :data-type="cell.tablesaw && cell.tablesaw.type?cell.tablesaw.type:false")
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='createdAt') Создан
                    th.sortable(scope='col', data-tablesaw-priority='1', data-sort='updatedAt') Изменен
                    th(colspan='2') Действия
            tbody
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
                    td(v-for="(cell,j) in grid.last()", v-if="cell.id",
                    class="{'mdl-data-table__cell--non-numeric': !cell.tablesaw || !cell.tablesaw.type || cell.tablesaw.type!=='number'}")
                        label(v-html="getValue(row,cell.id)")
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
        slot(name="editModal", :editingRow="editingRow", :saveRow="saveRow", :getItems="getItems", :getValue="getValue")

        //mdl-dialog(ref='editModal', :title="editingRow._id?'Редактирование записи':'Добавление записи'")
            form.editing-form(action='#')
                input(name='_id', v-model='editingRow._id', type='hidden')
                div(v-for="(cell,j) in structedGrid", v-if="cell.id", :style="{'padding-left':(cell.level-1)*15+'px', width: 'calc(100% - '+(cell.level-1)*15+'px)'}")
                    div(v-if="cell.children")
                        p(v-html="cell.title")
                    div(v-else)
                        mdl-textfield.mdl-textfield--full-width(v-if="cell.type!=='select'", :floating-label="cell.title.replace('<br>', ' ')", v-model="deep[`editingRow.${cell.id}`]", :readonly="cell.readonly")
                        mdl-select.mdl-textfield--full-width(v-else, :label='cell.title', :id="`select-editingRow.${cell.id}`", v-model='deep[`editingRow.${cell.id}`]', :options='cell.items', :readonly="cell.readonly")
            //form.editing-form(action='#')
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
                default: {}
            },
            inRows: {
                type: Array,
                default: []
            },
        },
        data: function () {
            let struct = this.options.struct;
            let rowSeed = getSeed({children: struct});
            let selSeed = recValue(rowSeed, 1);
            rowSeed._id = "";
            selSeed.createdAt = 1;
            selSeed.updatedAt = 1;

            /*struct.unshift({id: "checks", title: "1", type: String, default: ""});
            struct.unshift({
                id: "actions", title: "действия", children:
                    [
                        {id: "edit", title: "редактировать", type: String, default: ""},
                        {id: "remove", title: "удалить", type: String, default: ""},
                    ]
            });
            struct.unshift({id: "num", title: "№", type: Number, default: 0});*/
//            console.log('struct',struct);
            let united = getUnited(struct);
            // console.log('united',curArr)
            let grid = getGrid(united);
//            console.log('grid',grid.slice());
            for(let i in grid) {
                if(Number(i)+1<grid.length) {
                    if(grid[i][0].title==="") {
                        grid[i][0].colspan += 4;
                    } else {
                        grid[i].unshift({title: "",colspan:4})
                    }

                    if(grid[i].last().title==="") {
                        grid[i].last().colspan += 4;
                    } else {
                        grid[i].push({title: "",colspan:4})
                    }
                }
            }

            let tfConf = {
                col_0: "none",
                col_1: "none",
                col_2: "none",
                filters_row_index: grid.length+1,
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
            };
            tfConf["col_"+(Number(grid.last().length)+6)] = "none";
            tfConf["col_"+(Number(grid.last().length)+7)] = "none";

            for(let i in grid.last()) {
                let cell = grid.last()[i];
                let tablefilter = cell.tablefilter;
                if(tablefilter) {
                    if(tablefilter.type) {
                        tfConf["col_"+(Number(i)+4)] = tablefilter.type;
                    }
                }
            }
            tfConf = Object.assign(tfConf, this.options.tfConf || {});
//            console.log(tfConf);
//            console.log(grid);
            return Object.assign({
                perPage: this.options.perPage || 10,
                page: 1,
                checks: [],
                rows: this.options.inRows || [],
                checkAll: false,
                edit: -1,
                checkAllChanged: false,
                savedRow: null,
                struct,
                united,
                grid,
                rowSeed,
                selSeed,
                editingRow: clone(rowSeed),
                sel: clone(selSeed),
                toRemove: [],
                tfConf,
                test: "",
                tf: null
            }, this.options.data || {})
        },
        computed: {
            isClosed: function () {
                return this.getSelCnt(this.sel) !== this.getSelCnt(this.selSeed)
            },
            maxPage: function () {
                return Math.ceil(this.rows.length / this.perPage) || 1;
            },
            selFooter: function () {
                return 4 + this.getSelCnt(this.selSeed) + 2;
            },
            copyRows: function () {
                return clone(this.rows);
            },
            structedGrid() {
                let resArr = [];
                function addRec(arr, level = 1) {
                    arr.slice().forEach(item => {
                        let nextLevel = level;
//                        console.log(item.title, level);
                        item.level = level;
                        if(item.title) {
                            nextLevel += 1;
                            resArr.push(item);
                        }
                        if(item.children) {
                            addRec(item.children,nextLevel);
                        }
                    })
                }
                addRec(this.united);
                return resArr;
            },
        },
        methods: {
            getValue(row, path,db = false) {
                let value = getInObj(row,path);
                let options = this.grid.last().filter(item => {return item.id && item.id===path}).first();
                if (options) {
                    if (options.type === 'select' && options.items) {
                        value = this.getName(options.items, value)
                    } else if (options.cb) {
                        value = options.cb(value,row);
                        if(db)
                            console.log(value,row);
                    }
                }
                return value;
            },
            getInObj(...args) {
                return getInObj(...args);
            },
            getItems(path) {
                for(let cell of this.grid.last()) {
                    if(cell.id===path) {
                        return cell.items;
                    }
                }
                return [];
            },
            removeClosed: function () {
                this.sel = clone(this.selSeed);
                return true;
            },
            recValue: function (arr, val) {
                return recValue(arr, val);
            },
            getSelCnt: function (arr) {
                arr = clone(arr);
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
                    this.rows.splice(index + 1, 0, clone(this.rowSeed));
                    this.edit = index;
                    setTimeout(() => this.tf.Mod.paging.setPage('last'), 0);

                } catch (e) {
                    console.error(e);
                }
            },

            inquireRemove: function (input) {
                this.toRemove = input;
                this.$refs.removeModal.open();
            },
            removeRows: function () {
                let indexes = clone(this.toRemove);
                indexes.sort(compareNumbers).reverse();
                let ln = indexes.length;

                // Будем работать с буфером
                let rows = clone(this.rows);
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

                if (this.options.onRemove) {
                    $.proxy(this.options.onRemove, this)();
                }
            },
            initTf() {
                setTimeout(() => {
                    if (this.tf) {
                        this.tf.destroy();
                    }
                    this.tf = new TableFilter(this.$refs.table, this.tfConf, this.tfConf.filters_row_index);
                    this.tf.init();
//                    console.log(this.tf);
                }, 0);
            },
            editRow: function (index) {
                if (this.rows[index]) {
                    this.editingRow = clone(this.rows[index]);
                    this.editingRow.index = index;
                } else {
                    this.editingRow = clone(this.rowSeed);
                }
                this.$parent.$refs.editModal.open();
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
                    if (this.options.insertRow) {
                        $.proxy(this.options.insertRow, this)(item);
                    } else {
                        db.insert(Object.assign({table: this.options.table}, item), $.proxy(function (err, newItem) {
                            item._id = newItem._id;
                            this.rows.push(item);
                            this.$root.$emit('msgSent', {message: 'Сохранено'});
                            this.$parent.$refs.editModal.close();
                            if (this.options.onInsert) {
                                $.proxy(this.options.onInsert, this)();
                            }
                        }, this));
                    }
                } else {
                    console.log('update');
                    if (this.options.updatetRow) {
                        $.proxy(this.options.updatetRow, this)(item);
                    } else {
                        db.update({
                            table: this.options.table,
                            _id: item._id
                        }, {$set: item}, $.proxy(function (err, code) {
                            this.rows.splice(index, 1, item);
                            this.$root.$emit('msgSent', {message: 'Сохранено'});
                            this.$parent.$refs.editModal.close();
                            if (this.options.onUpdate) {
                                $.proxy(this.options.onUpdate, this)();
                            }
                        }, this));
                    }
                }
                if (this.options.onSave) {
                    $.proxy(this.options.onSave, this)();
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
                if (this.options.setRows) {
                    this.options.setRows.bind(this)();
                } else {
                    db.find({table: this.options.table}).sort({createdAt: 1}).exec($.proxy(function (err, rows) {
                        this.rows = rows;
                        this.initTf();
                    }, this));
                }
            },
            paginating: function () {
                this.checks = [];
            }
        },
        created: function () {
            this.setRows();
            window.appt = this;
            this.watchCollection(['checks'], this.toggleCheck);
            this.watchCollection(['rows'], ()=> this.$parent.rows=this.rows, {deep: true});
            // this.watchCollection(['page'], this.paginating);
            this.watchCollection(['copyRows'], (newVal, oldVal) => {
                if (this.tf) {
                    let curPage = this.tf.Mod.paging.currentPageNb;
                    setTimeout(() => {
                        this.tf.refreshFilters();
                        this.tf.Mod.paging.destroy();
                        this.tf.Mod.paging.init();
                        setTimeout(() => {
                            if (oldVal.length < newVal.length || curPage > this.tf.Mod.paging.nbPages) {
//                                console.log('last');
                                this.tf.Mod.paging.setPage('last');
                                // debugger;
                            } else {
//                                console.log('cur', curPage);
                                this.tf.Mod.paging.setPage(curPage);
                            }
                        }, 0);
                    }, 0);
                }
            });
            console.log(this.struct);

            if (this.options.methods) {
                for(let name in this.options.methods) {
                    this[name] = this.options.methods[name];
                }
            }

            if (this.options.created) {
                $.proxy(this.options.created, this)();
            }
        },
        mounted: function () {
            let $tCont = $('.table-container');
            $tCont.find('.mdl-textfield').addClass('is-dirty');

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

            $(document).on('change', '.tablesaw-columntoggle-popup input[type="checkbox"]', $.proxy(function (e, tablesaw) {
                $('.tablesaw-toggle-cellhidden').each($.proxy((i, th) => {
                    let model = th.getAttribute('data-sort');
                    eval('this.sel.' + model + ' = 0;');
                }, this))
            }, this));

            $tCont.on('click', '.sortable', $.proxy(function (e) {
                let $th = $(e.target);
                if (!$th.hasClass('sortable')) {
                    return false;
                }
                // let rows = clone(this.rows);
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
                let f = t * -1;

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
                    return a1 > b1 ? t : (a1 === b1 ? 0 : f);
                }

                this.rows.sort(compare);
            }, this));

            if (this.options.mounted) {
                $.proxy(this.options.mounted, this)();
            }
        },
    }
</script>
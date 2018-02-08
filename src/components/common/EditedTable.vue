<template>
    <div class="table-container">
        <table id="table" data-tablesaw-mode="columntoggle" ref="table" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table">
            <thead>
            <tr data-tablesaw-ignorerow="" v-show="options.title">
                <th :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                    <h4>{{options.title}}</h4>
                </th>
            </tr>
            <tr v-for="(row,j) in grid" v-if="j&lt;grid.length-1" data-tablesaw-ignorerow="" class="center-all">
                <th v-for="(cell,i) in row" :colspan="cell.colspan" v-html="cell.title"></th>
            </tr>
            <tr class="center-all wide-all">
                <th class="mdl-th-padding text-center" width="67px"><mdl-checkbox id="checkAll" v-model="checkAll" @change.native="toggleCheckAll" :disabled="edit"></mdl-checkbox></th>
                <th colspan="2" class="text-center" width="85px">Действия</th>
                <th scope="col" class="text-center" width="50px">№</th>
                <th v-for="(cell,i) in grid[grid.length-1]" :colspan="cell.colspan" v-html="cell.title" scope="col" data-tablesaw-priority="1" :data-sort="cell.id" :width="cell.width?cell.width:false" :data-type="cell.tablesaw &amp;&amp; cell.tablesaw.type?cell.tablesaw.type:false" class="sortable"></th>
                <th scope="col" data-tablesaw-priority="1" data-sort="createdAt" class="sortable">Создан</th>
                <th scope="col" data-tablesaw-priority="1" data-sort="updatedAt" class="sortable">Изменен</th>
                <th colspan="2" class="text-center" width="85px">Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index">
                <td class="text-center"><mdl-checkbox v-model="checks" :val="index" :disabled="edit"></mdl-checkbox></td>
                <td @click="editRow(index)" data-tooltip="Редактировать" class="clickable tooltip text-center"><i class="fa fa-pencil"></i></td>
                <td @click="inquireRemove([index])" data-tooltip="Удалить" class="clickable tooltip text-center"><i class="fa fa-times"></i></td>
                <td>{{index+1}}<input name="_id" v-model="row._id" type="hidden"/></td>
                <td v-for="(cell,j) in grid.last()" v-if="cell.id" :class="{'mdl-data-table__cell--non-numeric': !cell.tablesaw || !cell.tablesaw.type || cell.tablesaw.type!=='number'}">
                    <label>{{getValue(row,cell.id)}}</label>
                </td>
                <td v-if="sel.createdAt" class="mdl-data-table__cell--non-numeric">{{row.createdAt | myDateTime}}</td>
                <td v-if="sel.updatedAt" class="mdl-data-table__cell--non-numeric">{{row.updatedAt | myDateTime}}</td>
                <td @click="editRow(index)" data-tooltip="Редактировать" class="clickable tooltip text-center"><i class="fa fa-pencil"></i></td>
                <td @click="inquireRemove([index])" data-tooltip="Удалить" class="clickable tooltip text-center"><i class="fa fa-times"></i></td>
            </tr>
            </tbody>
            <tfoot>
            <tr class="hidden">
                <td v-for="(cell,j) in grid.last()" v-if="cell.id"></td>
                <td v-for="j in 8"></td>
            </tr>
            <tr>
                <td :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                    <div id="paging"></div>
                </td>
            </tr>
            <tr>
                <td :colspan="selFooter" class="mdl-data-table__cell--non-numeric">
                    <mdl-button :disabled="edit" @click.native="editRow(rows.index)" class="mdl-js-ripple-effect">Добавить запись</mdl-button>
                    <mdl-button :disabled="edit || checks.length===0" @click.native="inquireRemove(checks)" class="mdl-js-ripple-effect">Удалить отмеченные</mdl-button>
                    <mdl-button v-if="isClosed" @click.native="removeClosed()" class="mdl-js-ripple-effect">Показать скрытые</mdl-button>
                </td>
            </tr>
            </tfoot>
        </table>
        <mdl-dialog ref="removeModal" title="Удаление записей">
            <p>Вы действительно хотите удалить {{toRemove.length!==1?'выбранные записи':'выбранную запись'}}?</p>
            <div slot="actions">
                <mdl-button @click.native="$refs.removeModal.close">Отменить</mdl-button>
                <mdl-button primary="" @click.native="removeRows()">Удалить</mdl-button>
            </div>
        </mdl-dialog>
        <slot name="editModal" :editingRow="editingRow" :saveRow="saveRow" :closeEdit="closeEdit" :getItems="getItems" :dicts="dicts" :getValue="getValue"></slot>
        <!--<mdl-dialog ref="editModal" :title="editingRow._id?'Редактирование записи':'Добавление записи'">
            <form action="#" class="editing-form">
                <input name="_id" v-model="editingRow._id" type="hidden"/>
                <div v-for="(cell,j) in structedGrid" v-if="cell.id" :style="{'padding-left':(cell.level-1)*15+'px', width: 'calc(100% - '+(cell.level-1)*15+'px)'}">
                    <div v-if="cell.children">
                        <p v-html="cell.title"></p>
                    </div>
                    <div v-else="v-else">
                        <mdl-textfield v-if="cell.type!=='select'" :floating-label="cell.title.replace('&lt;br&gt;', ' ')" v-model="deep[`editingRow.${cell.id}`]" :readonly="cell.readonly" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>
                        <mdl-select v-else="v-else" :label="cell.title" :id="`select-editingRow.${cell.id}`" v-model="deep[`editingRow.${cell.id}`]" :options="cell.items" :readonly="cell.readonly" class="mdl-textfield&#45;&#45;full-width"></mdl-select>
                    </div>
                </div>
            </form>
            <div slot="actions">
                <mdl-button @click.native="$refs.editModal.close">Отменить</mdl-button>
                <mdl-button primary="" @click.native="saveRow()">Сохранить</mdl-button>
            </div>
        </mdl-dialog>-->
        <mdl-snackbar display-on="msgSent" class="mdl-snackbar_padding"></mdl-snackbar>
    </div>


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
            let dicts = {};

            for(let cell of clone(grid.last())) {
                if(cell.type==='select') {
                    let path = cell.id.split('.');
                    let res = dicts;
                    for (let i in path) {
                        let p = path[i];
                        res[p] = !res[p] ? (i==path.length-1 ? [] : {}) : res[p];
                        res = res[p];
                    }
                }
            }

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
                edit: false,
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
                dicts,
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
            getInterval: function (d1, d2) {
                d1 = moment(d1);
                d2 = moment(d2);
                return d1.diff(d2, 'minutes');
            },
            getIntervalString: function (mins) {
                let data = {};
                data.days = Math.floor(Math.floor(mins/60)/24);
                data.hours = Math.floor((mins)/60) - data.days*24;
                data.minutes = mins - (data.hours + data.days*24)*60;
                let result = '';
                if (data.days && data.days > 0) {
                    result += data.days + ' сут';
                }
                if (data.hours && data.hours > 0) {
                    result = result + ((result.length > 0) ? ' ' : '') + data.hours + ' час';
                }
                if (data.minutes && data.minutes > 0) {
                    result = result + ((result.length > 0) ? ' ' : '') + data.minutes + ' мин';
                }
                return result;
            },
            getValue(row, path) {
                let value = getInObj(row,path);
                let options = this.grid.last().filter(item => {return item.id && item.id===path}).first();
                if (options) {
                    if (options.type === 'interval') {
                        value = this.getIntervalString(value)
                    } else if (options.type === 'datetime') {
                        value = moment(value).isValid()?moment(value).format('DD.MM.YYYY HH:mm'):'';
                    } else if (options.type === 'date') {
                        value = moment(value).isValid()?moment(value).format('DD.MM.YYYY'):'';
                    } else if (options.cb) {
                        value = options.cb(value,row);
                    }
                }
                return value;
            },
            getInObj(...args) {
                return getInObj(...args);
            },
            getItems(path) {
//                if(this.test!=="") {
//                    for (let cell of this.grid.last()) {
//                        if (cell.id === path) {
//                            return clone(cell.items).map(item => {
//                                item.value += (new Date()).getSeconds();
//                                item.name += (new Date()).getSeconds();
//                                return item;
//                            });
//                        }
//                    }
//                }
//                this.test = "123";
                let items = getInObj(this.dicts,path);
                if(items) {
                    return items.map(item => (item.value));
                }
                return null;
            },
            changeItems() {

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
                        if(this.options.saveRow) {
                            this.options.removeRow(id);
                        } else {
                            throw new Error('saveRow не определено');
                        }
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
                if(this.rows.length) {
                    setTimeout(() => {
                        if (this.tf) {
                            this.tf.destroy();
                        }
                        this.tf = new TableFilter(this.$refs.table, this.tfConf, this.tfConf.filters_row_index);
                        this.tf.init();
                    }, 0);
                }
            },
            editRow: function (index) {
                if (this.rows[index]) {
                    this.editingRow = clone(this.rows[index]);
                    this.editingRow.index = index;
                } else {
                    this.editingRow = clone(this.rowSeed);
                }
                this.edit = true;
                this.$parent.$refs.editModal.open();

                setTimeout(()=> {
                    let el = $(this.$parent.$refs.editModal.$el).find('input:not([type="hidden"])')[0];
                    if(el) $(el).focus()
                },50);
            },
            closeEdit: function () {
                this.$parent.$refs.editModal.close();
                this.edit = false;
                this.editingRow = clone(this.rowSeed);
            },
            saveRow: function () {
                let item = this.editingRow;
                let index = item.index;
                delete item.index;
                if(this.options.saveRow) {
                    this.options.saveRow(item).then(({insert,doc}) => {
                        if(insert) {
                            this.rows.push(doc);
                            if(this.rows.length===1) {
                                this.initTf();
                            }
                        } else {
                            this.rows.splice(index, 1, doc);
                        }
                        this.$root.$emit('msgSent', {message: 'Сохранено'});
                        this.closeEdit();
                    });
                } else {
                    throw new Error('saveRow не определено');
                }
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
            toggleCheckAll() {
                // Кликнули по общему чб
                this.checks = [];
                if (this.checkAll) {
                    for (let i = (this.page - 1) * this.perPage; i < this.rows.length && i < this.page * this.perPage; i++) {
                        this.checks.push(i);
                    }
                }
            },
            setRows() {
                if (this.options.setRows) {
                    this.options.setRows.call(this).then(() => {
                        for(let i in this.rows) {
                            Vue.set(this.rows, i, this.repairRow(this.rows[i]));
                        }
                    });
                } else {
                    throw new Error('setRow не определено');
                }

                if(this.options.setDicts) {
                    this.options.setDicts.call(this);
                }
            },
            paginating() {
                this.checks = [];
            },
            repairRow(row, level = 0) {
                for(let cell of clone(this.grid.last())) {
                    let path = cell.id.split('.');
                    let res = row;
                    for(let i in path) {
                        let p = path[i];
                        if(res[p] === undefined) {
                            if(i == path.length-1) {
                                res[p] = cell.default;
                            } else {
                                res[p] = {};
                            }
                        }
                        res = res[p];
                    }
                }
                return row;
            }
        },
        created: function () {
            this.setRows();
            window.appt = this;
            this.watchCollection(['checks'], this.toggleCheck);
            this.watchCollection(['rows'], ()=> this.$parent.rows=this.rows, {deep: true});
             this.watchCollection(['tf.Mod.paging.currentPageNb'], this.paginating);
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

            if (this.options.methods) {
                for(let name in this.options.methods) {
                    this[name] = this.options.methods[name];
                }
            }

            if (this.options.created) {
                this.options.created.call(this);
            }
        },
        mounted: function () {
            let $tCont = $('.table-container');
//            $tCont.find('.mdl-textfield').addClass('is-dirty');

            $(document).on('keyup', e => {
                if (this.edit) {
                    if (e.keyCode === 13 && ((e.target.type !== 'textarea' && !$(e.target).hasClass('ui-autocomplete-input'))
                            || e.ctrlKey || e.altKey)) {
                        this.saveRow();
                        $('.ui-datepicker').hide();
                        return false;
                    }
                    if (e.keyCode === 27) {
                        this.closeEdit();
                        $('.ui-datepicker').hide();
                        return false;
                    }
                }
            });

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

<style>
    .edited-table {
        width: 100%;
    }
</style>
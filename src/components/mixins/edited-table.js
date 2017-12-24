let Vue = require("vue/dist/vue.js");

export default function (options) {
    return {
        data: function () {
            return Object.assign({
                rows: [],
                sel: JSON.parse(JSON.stringify(options.selSeed)),
                perPage: options.perPage || 10,
                page: 1,
                checks: [],
                checkAll: false,
                edit: -1,
                checkAllChanged: false,
                savedRow: null,
                toRemove: [],
            }, options.data || {})
        },
        computed: Object.assign({
            isClosed: function () {
                return this.getSelCnt(this.sel) !== this.getSelCnt(options.selSeed)
            },
            maxPage: function () {
                return Math.ceil(this.rows.length / this.perPage) || 1;
            },
            selFooter: function () {
                return 4 + this.getSelCnt(options.selSeed) + 2;
            },
        }, options.computed || {}),
        methods: Object.assign({
            removeClosed: function () {
                this.sel = JSON.parse(JSON.stringify(options.selSeed));
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
                    this.rows.splice(index + 1, 0, JSON.parse(JSON.stringify(options.rowSeed)));
                    this.edit = index;
                    this.page = this.maxPage;
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
                        db.remove({table: options.table, _id: id});
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
                if (this.page > this.maxPage) {
                    this.page = this.maxPage;
                }
                this.toRemove = [];
                this.$refs.removeModal.close();
                this.$root.$emit('msgSent', {message: 'Удалено'})

                if(options.onRemove) {
                    options.onRemove(this);
                }
            },
            editRow: function (index) {
                this.edit = index;

                this.savedRow = JSON.parse(JSON.stringify(this.rows[index]));
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
            saveRow: function (index) {
                let item = this.rows[index];
                if (!item._id) {
                    item._id = undefined;
                    console.log('insert');
                    db.insert(Object.assign({table: options.table}, item), $.proxy(function (err, newItem) {
                        item._id = newItem._id;
                        this.$root.$emit('msgSent', {message: 'Сохранено'})
                    }, this));
                } else {
                    console.log('update');
                    db.update({table: options.table, _id: item._id}, {$set: item}, $.proxy(function (err, code) {
                        this.$root.$emit('msgSent', {message: 'Сохранено'})
                    }, this));
                }
                if(options.onSave) {
                    options.onSave(this);
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
                db.find({table: options.table}).sort({createdAt:1}).exec($.proxy(function (err, rows) {
                    this.rows = rows;
                }, this));
            },
            paginating: function () {
                this.checks = [];
            }
        }, options.methods || {}),
        created: function () {
            if(options.init) {
                options.init(this);
            } else {
                this.setRows();
            }
            this.watchCollection(['checks'], this.toggleCheck);
            this.watchCollection(['page'], this.paginating);
            if(options.created) {
                options.created(this);
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

            if(options.mounted) {
                options.mounted(this);
            }
        },
    }
};
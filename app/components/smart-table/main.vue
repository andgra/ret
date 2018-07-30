<template>
    <div class="edited-table-container">
        <loading v-show="loading > 0" :background="true"></loading>
        <div class="table-content">
            <slot name="header"></slot>
            <actions :controlAdd="controlAdd" :controlRemove="controlRemove" :checks="checks" :isClosed="isClosed" class="bordered-top"></actions>
            <div class="table-responsive after-actions">
                <table id="table" data-tablesaw-mode="columntoggle" ref="table" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table">
                    <thead>
                    <tr v-for="(row,j) in structure.grid" v-if="j<structure.grid.length-1" data-tablesaw-ignorerow="" class="center-all">
                        <th v-for="(cell,i) in row" :colspan="cell.colspan" v-show="cell.colspan && !cell.hidden">{{cell.title}}</th>
                    </tr>
                    <tr class="center-all wide-all">
                        <th v-if="controlRemove" class="mdl-th-padding text-center" width="67px">
                            <mdl-checkbox id="checkAll" v-model="checkAll" @change.native="toggleCheckAll" :disabled="editMode"></mdl-checkbox>
                        </th>
                        <th v-if="controlEdit || controlRemove" :colspan="controlEdit+controlRemove" class="text-center" :width="(controlEdit*43+controlRemove*43)+'px'">Действия</th>
                        <th scope="col" class="text-center" width="50px">№</th>
                        <th v-for="(cell,i) in structure.grid[structure.grid.length-1]" :colspan="cell.colspan" v-show="!cell.hidden" v-html="cell.title" scope="col" :data-tablesaw-priority="!cell.hidden ? 1 : false" :data-sort="cell.id" :width="cell.width?cell.width:false" :data-type="cell.tablesaw && cell.tablesaw.type?cell.tablesaw.type:false" class="sortable"></th>
                        <template v-if="controlDates">
                            <th class="sortable">Создан</th>
                            <th class="sortable">Изменен</th>
                        </template>
                        <th v-if="controlEdit || controlRemove" :colspan="controlEdit+controlRemove" class="text-center" :width="(controlEdit*43+controlRemove*43)+'px'">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" v-bind:style="{ backgroundColor: (row.backgroundColor && row.backgroundColor !== '#ffffff') ? row.backgroundColor : '' }">
                        <td v-if="controlRemove" class="text-center" width="67px">
                            <mdl-checkbox v-model="checks" :val="index" :disabled="editMode"></mdl-checkbox>
                        </td>
                        <td @click="openEdit(index)" v-if="controlEdit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-pencil"></i></td>
                        <td @click="inquireRemove([index])" v-if="controlRemove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-times"></i></td>
                        <td>{{num(index)}}<input name="_id" v-model="row._id" type="hidden"/></td>
                        <td v-for="(cell,j) in structure.grid.last()" v-if="cell.id && cell.colspan && !cell.hidden" :class="{'mdl-data-table__cell--non-numeric': !cell.tablesaw || !cell.tablesaw.type || cell.tablesaw.type!=='number'}">
                            <label>{{getValue({row, path: cell.id})}}</label>
                        </td>
                        <template v-if="controlDates">
                            <td class="mdl-data-table__cell--non-numeric" style="white-space: nowrap">{{row.createdAt | myDateTime}}</td>
                            <td class="mdl-data-table__cell--non-numeric" style="white-space: nowrap">{{row.updatedAt | myDateTime}}</td>
                        </template>
                        <td @click="openEdit(index)" v-if="controlEdit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-pencil"></i></td>
                        <td @click="inquireRemove([index])" v-if="controlRemove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-times"></i></td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr class="hidden">
                        <td v-for="(cell,j) in structure.grid.last()" v-if="cell.id && cell.colspan && !cell.hidden"></td>
                        <td v-for="j in (controlEdit*2 + controlRemove*2 + controlDates*2 + 2)"></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="table-footer">
            <pagination class="bordered-bottom" />
            <actions :controlAdd="controlAdd" :controlRemove="controlRemove" :checks="checks" :isClosed="isClosed"></actions>
        </div>
        <mdl-dialog v-if="controlRemove" ref="removeModal" title="Удаление записей">
            <p>Вы действительно хотите удалить {{toRemove.length!==1?'выбранные записи':'выбранную запись'}}?</p>
            <div slot="actions">
                <mdl-button @click.native="$refs.removeModal.close">Отменить</mdl-button>
                <mdl-button primary="" @click.native="removeRows()">Удалить</mdl-button>
            </div>
        </mdl-dialog>
        <slot name="editModal">
            <!--todo: модаль по умолчанию-->
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
        </slot>
    </div>


</template>
<script>
  import moment from 'moment';
  import Pagination from '~components/smart-table/pagination';
  import Actions from '~components/smart-table/actions';
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    data: function () {
      return {
        checks: [],
        checkAll: false,
        tfConf: {},
        test: "",
        tf: null,
      };
    },
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['query', 'rows', 'info', 'loading', 'api', 'structure', 'editRow', 'options', 'toRemove', 'editModal']),
      ...mapGetters('table', ['count', 'sortBy', 'sortDirection', 'maxPage', 'editMode', 'num', 'page', 'limit']),
      controlRemove() {
        return this.options.remove === undefined || this.options.remove ? 1 : 0;
      },
      controlDates() {
        return this.options.dates === undefined || this.options.dates ? 1 : 0;
      },
      controlAdd() {
        return this.options.add === undefined || this.options.add ? 1 : 0;
      },
      controlEdit() {
        return this.options.edit === undefined || this.options.edit ? 1 : 0;
      },
      isClosed: function () {
//                return this.getSelCnt(this.sel) !== this.getSelCnt(this.selSeed)
        return false;
      },
      colspanFooter: function () {
        return (this.controlEdit * 2) + (this.controlRemove * 3) + this.getColspan(this.structure.grid.last()) + (this.controlDates * 2) + 1;
      },
      copyRows: function () {
        return clone(this.rows);
      },
      heading() {
        return this.controlEdit + this.controlRemove * 2 + 1;
      },
      trailing() {
        return this.controlDates * 2 + this.controlEdit + this.controlRemove;
      }
      /*structedGrid() {
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
      },*/
    },
    methods: {
      ...mapMutations('table', ['ADD_ROW', 'EDIT_ROW', 'CLOSE_EDIT', 'SET_REMOVE', 'UPDATE_EDIT_ROW', 'SET_STRUCTURE', 'SET_EDIT_MODAL']),
      ...mapActions('table', ['setPage', 'setSort', 'setLimit', 'saveEdit', 'openEdit', 'cancelEdit']),
      ...mapActions('table', {storeRemoveRows: 'removeRows'}),
      ...mapActions(['notify']),

      changeItems() {

      },
      removeClosed: function () {
//                this.sel = clone(this.selSeed);
        return true;
      },
      getColspan: function (arr) {
        let res = 0;
        for (let cell of arr) {
          res += cell.colspan;
        }
        return res;
      },
      getSelCnt: function (arr) {
        arr     = clone(arr);
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
        // try {
        //   this.rows.splice(index + 1, 0, clone(this.rowSeed));
        //   setTimeout(() => this.tf.Mod.paging.setPage('last'), 0);
        //
        // } catch (e) {
        //   console.error(e);
        // }
      },

      inquireRemove: function (input) {
        this.SET_REMOVE(input);
        this.$refs.removeModal.open();
      },
      removeRows: async function () {
        await this.storeRemoveRows();
        this.SET_REMOVE([]);
        this.$refs.removeModal.close();
        this.notify('Удалено');

        if (this.options.onRemove) {
          $.proxy(this.options.onRemove, this)();
        }
      },
      // initTf() {
      //   return;
      //   if (this.rows.length) {
      //     setTimeout(() => {
      //       if (this.tf) {
      //         this.tf.destroy();
      //       }
      //       let $thead                = $(this.$refs.table).find('thead');
      //       this.tfConf.paging.length = this.options.limit || Math.round((nwin.height - ($thead.height() + $thead.offset().top)) / 65);
      //       this.tf                   = new TableFilter(this.$refs.table, this.tfConf, this.tfConf.filters_row_index);
      //       this.tf.init();
      //     }, 0);
      //   }
      // },
      editRow1: function (index) {
        if (this.rows[index]) {
          this.EDIT_ROW(index);
        } else {
          this.ADD_ROW();
        }
        this.editModal.open();

        setTimeout(() => {
          let el = $(this.editModal.$el).find('input:not([type="hidden"])')[0];
          if (el) $(el).focus()
        }, 50);
      },
      toggleCheck: function () {
        // Кликнули по чб в строках
        let checkNum;
        if (this.count < this.page * this.limit) {
          checkNum = this.rows.length - (this.page - 1) * this.limit;
        } else {
          checkNum = this.limit;
        }

        this.checkAll = this.checks.length === checkNum;
      },
      toggleCheckAll() {
        // Кликнули по общему чб
        this.checks = [];
        if (this.checkAll) {
          for (let i = (this.page - 1) * this.limit; i < this.rows.length && i < this.page * this.limit; i++) {
            this.checks.push(i);
          }
        }
      },
      paginating() {
        this.checks = [];
      },
      initGrid() {
        let grid = this.structure.grid;
        for (let i in grid) {
          if (+i + 1 < grid.length) {
            for (let cell of grid[i]) {
              cell.orig = cell.colspan;
            }
            if (grid[i][0].title === "") {
              grid[i][0].colspan += this.heading;
            } else {
              grid[i].unshift({title: "", colspan: this.heading})
            }

            if (grid[i].last().title === "") {
              grid[i].last().colspan += this.trailing;
            } else {
              grid[i].push({title: "", colspan: this.trailing})
            }
          } else {
            for (let j in grid[i]) {
              grid[i][j].num = +JSON.parse(JSON.stringify(j));
            }
          }
        }
        this.SET_STRUCTURE({...this.structure, grid});
      },
      // initTfConf() {
      //   let tfConf = {
      //     filters_row_index: this.grid.length + 1,
      //     paging: {
      //       toolbar_position: 'left',
      //       page_text: 'стр',
      //       of_text: ' из ',
      //       target_id: 'paging'
      //     },
      //     clear_filter_text: " ",
      //     locale: "ru",
      //     refresh_filters: true,
      //   };
      //   if (this.controlEdit) {
      //     tfConf["col_" + (this.controlRemove)]                                                                     = "none";
      //     tfConf["col_" + (Number(this.grid.last().length) + (this.controlRemove * 2 + 2 + this.controlDates * 2))] = "none";
      //   }
      //   if (this.controlRemove) {
      //     tfConf["col_0"]                                                                                         = "none";
      //     tfConf["col_" + (this.controlEdit + 1)]                                                                 = "none";
      //     tfConf["col_" + (Number(this.grid.last().length) + (this.controlEdit * 2 + 3 + this.controlDates * 2))] = "none";
      //   }
      //
      //   let j = 0;
      //   for (let i in this.grid.last()) {
      //     let cell = this.grid.last()[i];
      //     if (cell.colspan) {
      //       let tablefilter = cell.tablefilter;
      //       if (tablefilter) {
      //         if (tablefilter.type) {
      //           tfConf["col_" + (Number(j) + this.heading)] = tablefilter.type;
      //         }
      //       }
      //       j++;
      //     }
      //   }
      //   this.tfConf = Object.assign(tfConf, this.options.tfConf || {});
      // }
    },
    created: function () {
      console.log('smart-table created');

      window.appt = this;
      this.watchCollection(['checks'], this.toggleCheck);
      // this.watchCollection(['rows'], () => this.$parent.rows = this.rows, {deep: true});
      // this.watchCollection(['tf.Mod.paging.currentPageNb'], this.paginating);
//       this.watchCollection(['copyRows'], (newVal, oldVal) => {
//         if (this.tf) {
//           let curPage = this.tf.Mod.paging.currentPageNb;
//           setTimeout(() => {
//             this.tf.refreshFilters();
//             this.tf.Mod.paging.destroy();
//             this.tf.Mod.paging.init();
//             setTimeout(() => {
//               if (oldVal.length < newVal.length || curPage > this.tf.Mod.paging.nbPages) {
// //                                console.log('last');
//                 this.tf.Mod.paging.setPage('last');
//                 // debugger;
//               } else {
// //                                console.log('cur', curPage);
//                 this.tf.Mod.paging.setPage(curPage);
//               }
//             }, 0);
//           }, 0);
//         }
//       });

      $(document).on('keyup', e => {
        if (this.editMode) {
          if (e.keyCode === 13 && ((e.target.type !== 'textarea' && !$(e.target).hasClass('ui-autocomplete-input'))
            || e.ctrlKey || e.altKey)) {
            this.saveEdit();
            $('.ui-datepicker').hide();
            return false;
          }
          if (e.keyCode === 27) {
            this.cancelEdit();
            $('.ui-datepicker').hide();
            return false;
          }
        }
      });

      if (this.options.methods) {
        for (let name in this.options.methods) {
          this[name] = this.options.methods[name];
        }
      }

      if (this.options.created) {
        this.options.created.call(this);
      }
    },
    mounted: function () {
      this.initGrid();
      let $tCont = $('.table-container');
      if(this.$slots.editModal) {
        this.SET_EDIT_MODAL(this.$slots.editModal[0].componentInstance);
      }
//            $tCont.find('.mdl-textfield').addClass('is-dirty');

      $tCont.on('change', '.tablesaw-columntoggle-popup input[type="checkbox"]', (e, tablesaw) => {
        let th         = $(e.target).data("tablesaw-header");
        let id         = $(th).data('sort');
        let change     = e.target.checked ? 1 : -1;
        let targetCell = this.structure.grid.last().find(item => (item.id == id));
        console.log(th, id, change, targetCell, clone(this.structure.grid.last()));
        targetCell.colspan += change;
        if (this.tf) {
          let tfRow = $('.' + this.tf.fltsRowCssClass)[0];
          if (tfRow) {
            this.initTfConf();
            this.initTf();
          }
        }
        for (let i in this.structure.grid) {
          if (Number(i) + 1 < this.structure.grid.length) {
            let cnt = 0;
            for (let cell of this.structure.grid[i]) {
              cnt += cell.orig;
              if (targetCell.num < cnt) {
                cell.colspan += change;
                break;
              }
            }
          }
        }
      });

      $tCont.on('click', '.sortable', e => {
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
      });

      if (this.options.mounted) {
        this.options.mounted.call(this);
      }
    },
    components: {
      'pagination': Pagination,
      'actions': Actions,
    }
  }
</script>

<style>
    .edited-table {
        width: 100%;
    }
</style>
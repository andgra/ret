<template>
    <div class="edited-table-container">
        <loading v-show="loading > 0" :background="true"></loading>
        <div class="table-header">
            <slot name="header"></slot>
            <actions :isClosed="isClosed" class="bordered-top"></actions>
        </div>
        <div class="table-content">
            <div class="table-responsive after-actions">
                <table id="table" data-tablesaw-mode="columntoggle" ref="table" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp border-all-cells edited-table">
                    <thead is="table-header"></thead>
                    <tbody>
                    <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" v-bind:style="{ backgroundColor: (row.backgroundColor && row.backgroundColor !== '#ffffff') ? row.backgroundColor : '' }">
                        <td v-if="controls.checks" class="text-center" width="67px">
                            <mdl-checkbox :value="checked(row._id)" @change.native="toggleCheck(row._id)" :disabled="editMode"></mdl-checkbox>
                        </td>
                        <td @click="openEdit(index)" v-if="controls.edit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-pencil"></i></td>
                        <td @click="inquireRemove([index])" v-if="controls.remove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-times"></i></td>
                        <td>{{num(index)}}<input name="_id" v-model="row._id" type="hidden"/></td>
                        <td v-for="(cell,j) in lastOfGrid" v-if="cell.id && cell.colspan && !cell.hidden" :class="{'mdl-data-table__cell--non-numeric': !cell.sortType || cell.sortType!=='number'}">
                            <label>{{getValue({row, path: cell.id})}}</label>
                        </td>
                        <template v-if="controls.dates">
                            <td class="mdl-data-table__cell--non-numeric" style="white-space: nowrap">{{row.createdAt | myDateTime}}</td>
                            <td class="mdl-data-table__cell--non-numeric" style="white-space: nowrap">{{row.updatedAt | myDateTime}}</td>
                        </template>
                        <td @click="openEdit(index)" v-if="controls.edit" data-tooltip="Редактировать" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-pencil"></i></td>
                        <td @click="inquireRemove([index])" v-if="controls.remove" data-tooltip="Удалить" class="clickable tooltip text-center" width="43px">
                            <i class="fa fa-times"></i></td>
                    </tr>
                    </tbody>
                    <!--<tfoot>-->
                    <!--<tr class="hidden">-->
                        <!--<td v-for="(cell,j) in structure.grid.last()" v-if="cell.id && cell.colspan && !cell.hidden"></td>-->
                        <!--<td v-for="j in (controlEdit*2 + controlRemove*2 + controlDates*2 + 2)"></td>-->
                    <!--</tr>-->
                    <!--</tfoot>-->
                </table>
            </div>
        </div>
        <div class="table-footer">
            <pagination class="bordered-bottom"/>
            <actions :isClosed="isClosed"></actions>
        </div>
        <mdl-dialog v-if="controls.remove" ref="removeModal" title="Удаление записей">
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
  import Header from '~components/smart-table/header';
  import Pagination from '~components/smart-table/pagination';
  import Actions from '~components/smart-table/actions';
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    data: function () {
      return {
        tfConf: {},
        test: "",
        tf: null,
      };
    },
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['query', 'rows', 'info', 'loading', 'api', 'structure', 'editRow', 'options', 'toRemove', 'editModal']),
      ...mapGetters('table', ['count', 'editMode', 'controls', 'heading', 'trailing', 'lastOfGrid', 'dots', 'num', 'checked']),

      isClosed: function () {
//                return this.getSelCnt(this.sel) !== this.getSelCnt(this.selSeed)
        return false;
      },
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
      ...mapMutations('table', ['ADD_ROW', 'EDIT_ROW', 'CLOSE_EDIT', 'SET_REMOVE', 'UPDATE_EDIT_ROW', 'SET_STRUCTURE', 'TOGGLE_CHECK']),
      ...mapActions('table', ['setPage', 'toggleSort', 'setLimit', 'saveEdit', 'openEdit', 'cancelEdit']),
      ...mapActions('table', {storeRemoveRows: 'removeRows'}),
      ...mapActions(['notify']),
      toggleCheck(index) {
        this.TOGGLE_CHECK(index);
      },
      removeClosed: function () {
//                this.sel = clone(this.selSeed);
        return true;
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
      // this.watchCollection(['checks'], this.toggleCheck);
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
      Tablesaw.init();
      let $tCont = $('.table-container');
      if (this.$slots.editModal) {
        let editModal = this.$slots.editModal[0].componentInstance;
        this.$watch('editModal', newVal => newVal ? editModal.open() : editModal.close());
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
        this.toggleSort($th.data('sort'));


        /*
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

        this.rows.sort(compare);*/
      });

      if (this.options.mounted) {
        this.options.mounted.call(this);
      }
    },
    components: {
      'table-header': Header,
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
<template>
    <div class="table-container">
        <!--<smart-table v-if="loaded"-->
        <!--:options="options"-->
        <!--:rows="rows"-->
        <!--:count="count"-->
        <!--:dicts="dicts"-->
        <!--:settings="settings"-->
        <!--:loading="tableLoading"-->
        <!--v-bind:page.sync="page"-->
        <!--v-bind:sort-by.sync="sortBy"-->
        <!--v-bind:sort-direction.sync="sortDirection"-->
        <!--v-bind:limit.sync="limit"-->
        <!--&gt;-->
        <!--<template slot="editModal" slot-scope="props">-->
        <!--<mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">-->
        <!--<form class="editing-form" action="#" onsubmit="return false;">-->
        <!--<input name="_id" v-model="props.editingRow._id" type="hidden"/>-->
        <!--<mdl-textfield floating-label="цвет заливки" v-model="props.editingRow.backgroundColor" type="color" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-autocomplete label="в/ч" v-model="props.editingRow.obj" :options="props.dicts.obj" :strict="true" class="mdl-textfield&#45;&#45;full-width"></mdl-autocomplete>-->
        <!--<mdl-autocomplete label="дислокация" v-model="props.editingRow.place" :options="props.dicts.place" :strict="false" class="mdl-textfield&#45;&#45;full-width"></mdl-autocomplete>-->
        <!--&lt;!&ndash;<mdl-textfield floating-label="дислокация" v-model="props.editingRow.place" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>&ndash;&gt;-->
        <!--<mdl-select id="editingRet" label="РЭТ" v-model="props.editingRow.ret" :options="props.dicts.ret" class="mdl-textfield&#45;&#45;full-width"></mdl-select>-->
        <!--<mdl-textfield floating-label="наличие пн" v-model="props.editingRow.pn" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-autocomplete id="editingTypeReq" label="тип РЭТ по штату" v-model.lazy="props.editingRow.type.req" :options="props.dicts.type.req" class="mdl-textfield&#45;&#45;full-width"></mdl-autocomplete>-->
        <!--<mdl-autocomplete id="editingTypeReal" label="тип РЭТ в наличии" v-model.lazy="props.editingRow.type.real" :options="props.dicts.type.real" class="mdl-textfield&#45;&#45;full-width"></mdl-autocomplete>-->
        <!--<mdl-textfield floating-label="заводской номер" v-model="props.editingRow.serial" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="год изготовления" v-model="props.editingRow.year" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<div class="form-group">-->
        <!--<p>вид и год последнего ремонта</p>-->
        <!--<div class="form-indent">-->
        <!--<mdl-select id="editingRepairType" label="вид" v-model="props.editingRow.repair.type" :options="props.dicts.repair.type" class="mdl-textfield&#45;&#45;full-width"></mdl-select>-->
        <!--<mdl-textfield floating-label="год" v-model="props.editingRow.repair.year" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--</div>-->
        <!--</div>-->
        <!--<mdl-select id="editingCondition" label="состояние РЭТ" v-model="props.editingRow.condition" :options="props.dicts.condition" class="mdl-textfield&#45;&#45;full-width"></mdl-select>-->
        <!--<div class="form-group">-->
        <!--<p>отв. за эксплуатацию, уход и сбережение</p>-->
        <!--<div class="form-indent">-->
        <!--<mdl-textfield floating-label="воинское звание" v-model="props.editingRow.resp.rank" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="ФИО" v-model="props.editingRow.resp.fio" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="приказ о закреплении" v-model="props.editingRow.resp.order" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="form-group">-->
        <!--<p>установленный ресурс РЭТ</p>-->
        <!--<div class="form-indent">-->
        <!--<mdl-textfield floating-label="ресурс до КР (час.)" v-model="props.editingRow.est.res.kr" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="ресурс до списания (час.)" v-model="props.editingRow.est.res.cancel" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="срок службы до КР (лет)" v-model="props.editingRow.est.life.kr" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="срок службы до списания (лет)" v-model="props.editingRow.est.life.cancel" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="form-group">-->
        <!--<p>наработка РЭТ</p>-->
        <!--<div class="form-indent">-->
        <!--<mdl-textfield floating-label="наработка с начала эксплуатации (час.)'" v-model="props.editingRow.elabor.elabor.total" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="наработка до КР (час.)" v-model="props.editingRow.elabor.elabor.before" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield floating-label="наработка после КР (час.)" v-model="props.editingRow.elabor.elabor.after" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="отработано ВСЕГО (лет)" :value="props.getValue(props.editingRow, 'elabor.dev.total')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="отработано до КР (лет)" :value="props.getValue(props.editingRow, 'elabor.dev.before')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="отработано после КР (лет)" :value="props.getValue(props.editingRow, 'elabor.dev.after')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="form-group">-->
        <!--<p>Запас ресурса образца РЭТ</p>-->
        <!--<div class="form-indent">-->
        <!--<mdl-textfield readonly="" floating-label="до КР (лет)" :value="props.getValue(props.editingRow, 'stock.year.kr.num')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до КР (%)" :value="props.getValue(props.editingRow, 'stock.year.kr.per')" type="text" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до списания (лет)" :value="props.getValue(props.editingRow, 'stock.year.cancel.num')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до списания (%)" :value="props.getValue(props.editingRow, 'stock.year.cancel.per')" type="text" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до КР (час)" :value="props.getValue(props.editingRow, 'stock.hour.kr.num')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до КР (%)" :value="props.getValue(props.editingRow, 'stock.hour.kr.per')" type="text" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до списания (час)" :value="props.getValue(props.editingRow, 'stock.hour.cancel.num')" type="number" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-textfield readonly="" floating-label="до списания (%)" :value="props.getValue(props.editingRow, 'stock.hour.cancel.per')" type="text" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--</div>-->
        <!--</div>-->
        <!--</form>-->
        <!--<div slot="actions">-->
        <!--<mdl-button @click.native="props.closeEdit()">Отменить</mdl-button>-->
        <!--<mdl-button primary="" @click.native="props.saveRow()">Сохранить</mdl-button>-->
        <!--</div>-->
        <!--</mdl-dialog>-->
        <!--</template>-->
        <!--</smart-table>-->
        <!--<loading v-else></loading>-->
    </div>
</template>

<script>
  // import store from '@/store/store';
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex';
  import set from '~models/set';
  import dictionary from '~models/dictionary';
  import moment from 'moment';
  import filters from '~js/modules/filters';
  import {mainMixin, paginationMixin, sortMixin, whereMixin, limitMixin} from '~mixins/smart-table';

  let struct =
        [
          {hidden: true, id: "backgroundColor", default: '#ffffff'},
          {id: "obj", title: "в/ч", type: 'select', default: "", tablefilter: {type: "select"}},
          {id: "place", title: "дислокация", type: 'text', default: "", tablefilter: {type: "select"}},
          {id: "ret", title: "РЭТ", type: 'select', default: "РЛС", tablefilter: {type: "select"}},
          {id: "pn", title: "Наличие <br>ПН", type: 'text', default: "", tablefilter: {type: "select"}},
          {
            id: "type", title: "", children:
              [
                {
                  id: "req",
                  title: "Тип РЭТ <br>по штату",
                  type: 'select',
                  default: "",
                  tablefilter: {type: "select"}
                },
                {
                  id: "real",
                  title: "Тип РЭТ <br>в наличии",
                  type: 'text',
                  default: "",
                  tablefilter: {type: "select"}
                },
              ]
          },
          {id: "serial", title: "Заводской <br>номер", type: 'text', default: ""},
          {
            id: "year",
            title: "Год <br>изготовления",
            type: 'number',
            default: 0,
            tablesaw: {type: "number"},
            tablefilter: {type: "select"}
          },
          {
            id: "repair", title: "Вид и год последнего ремонта", children:
              [
                {id: "type", title: "Вид", type: 'select', default: "КР", tablefilter: {type: "select"}},
                {
                  id: "year",
                  title: "Год",
                  type: 'number',
                  default: 0,
                  tablesaw: {type: "number"},
                  tablefilter: {type: "select"}
                },
              ]
          },
          {
            id: "condition",
            title: "Состояние РЭТ",
            type: 'select',
            items: [{name: 'Свернуто', value: 'closed'}, {name: 'Находится в эксплуатации', value: 'in_prod'}],
            default: "in_prod",
            tablefilter: {type: "select"}
          },
          {
            id: "resp", title: "Отв. за эксплуатацию, уход и сбережение", children:
              [
                {id: "rank", title: "В/зв", type: 'text', default: "", tablefilter: {type: "select"}},
                {id: "fio", title: "Ф.И.О.", type: 'text', default: ""},
                {id: "order", title: "Пр. о закреплении", type: 'text', default: ""},
              ]
          },
          {
            id: "est", title: "Установленный ресурс РЭТ", children:
              [
                {
                  id: "res", title: "", children:
                    [
                      {
                        id: "kr",
                        title: "ресурс до <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
                      {
                        id: "cancel",
                        title: "ресурс до <br>списания (час.)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
                    ]
                },
                {
                  id: "life", title: "", children:
                    [
                      {
                        id: "kr",
                        title: "срок службы <br>до КР (лет)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
                      {
                        id: "cancel",
                        title: "срок службы <br>до списания (лет)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
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
                      {
                        id: "total",
                        title: "наработка с начала <br>эксплуатации (час.)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
                      {
                        id: "before",
                        title: "наработка до <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
                      {
                        id: "after",
                        title: "наработка после <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        tablesaw: {type: "number"}
                      },
                    ]
                },
                {
                  id: "dev", title: "", children:
                    [
                      {
                        id: "total", title: "отработано <br>ВСЕГО (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.total = moment().format('YYYY') - entity.year;
                          return value
                        }, default: "", tablesaw: {type: "number"}, readonly: true
                      },
                      {
                        id: "before", title: "отработано <br>до КР (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.before = (entity.repair.type === 'КР' ? entity.repair.year : moment().format('YYYY')) - entity.year;
                          return value
                        }, default: "", tablesaw: {type: "number"}, readonly: true
                      },
                      {
                        id: "after", title: "отработано <br>после КР (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.after = entity.repair.type === 'КР' ? moment().format('YYYY') - entity.repair.year : 0;
                          return value
                        }, default: "", tablesaw: {type: "number"}, readonly: true
                      },
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
                            {
                              id: "num", title: "лет", type: 'text', cb(value, entity) {
                                value = entity.stock.year.kr.num = filters.r1(filters.NaN(entity.est.life.kr - entity.elabor.dev.before));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.year.kr.per = filters.r1(100 - filters.NaN(entity.elabor.dev.before / entity.est.life.kr * 100));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true, format: v => (v + '%')
                            },
                          ]
                      },
                      {
                        id: "cancel", title: "Запас ресурса до списания", children:
                          [
                            {
                              id: "num", title: "лет", type: 'text', cb(value, entity) {
                                value = entity.stock.year.cancel.num = filters.r1(filters.NaN(entity.est.life.cancel - entity.elabor.dev.total));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.year.cancel.per = filters.r1(100 - filters.NaN(entity.elabor.dev.total / entity.est.life.cancel * 100));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true, format: v => (v + '%')
                            },
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
                            {
                              id: "num", title: "час", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.kr.num = filters.r1(filters.NaN(entity.est.res.kr - entity.elabor.elabor.before));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.kr.per = filters.r1(100 - filters.NaN(entity.elabor.elabor.before / entity.est.res.kr * 100));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true, format: v => (v + '%')
                            },
                          ]
                      },
                      {
                        id: "cancel", title: "Запас ресурса до списания", children:
                          [
                            {
                              id: "num", title: "час", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.cancel.num = filters.r1(filters.NaN(entity.est.res.cancel - entity.elabor.elabor.total));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.cancel.per = filters.r1(100 - filters.NaN(entity.elabor.elabor.total / entity.est.res.cancel * 100));
                                return value
                              }, default: "", tablesaw: {type: "number"}, readonly: true, format: v => (v + '%')
                            },
                          ]
                      }
                    ]
                },
              ]
          }
        ];


  let options = {
    title: 'Таблица сводных данных',
    async created() {
      // при изменении типа РЭТ по штату менять установленный ресурс РЭТ
      this.$watch('editingRow.type.req', (newVal) => {
        if (this.dicts && this.dicts.type && this.dicts.type.req && this.dicts.type.req.length
          && !this.editingRow.est.res.kr && !this.editingRow.est.res.cancel && !this.editingRow.est.life.kr && !this.editingRow.est.life.cancel) {
          let found = this.dicts.type.req.find(item => (item.name == newVal));
          if (!found)
            return;
          let newEst = clone(found.est);
          if (newEst && isObject(newEst)) {
            this.editingRow.est = newEst;
            this.$root.$emit('msgSent', {message: 'Ресурс РЭТ подставлен'});
          }
        }
      });
    },
    async saveRow(item) {
      return await set.updateOrCreate({_id: item._id}, item);
    },
    async removeRow(id) {
      await set.delete(id);
    }
  };

  export default {
    // mixins: [mainMixin, paginationMixin, sortMixin, limitMixin, whereMixin],
    data() {
      return {
        options,
        // settings: {},
      }
    },
    // table,
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['query', 'rows', 'info', 'loading', 'model']),
      ...mapGetters('table', ['count', 'sortBy', 'sortDirection']),

      // ...mapState(['count']),
    },
    methods: {
      ...mapActions('settings', ['fetchSettings']),
      ...mapActions('table', ['reloadRows', 'loadData', 'setPage', 'setSort', 'setLimit']),
      // ...mapMutations('table', ['SET_MODEL']),
      // test(...args) { console.log(this.$table, this.count); this.$table.commit('increment') },
      async dataFetched({data, all}) {
        data.info.place = [...new Set(all.map(o => (JSON.stringify({value: o.place}))))].map(s => JSON.parse(s));
      },
      async getInfo() {
        let dictsArray = await Promise.all([
          dictionary.getDict('obj'),
          dictionary.getDict('ret'),
          dictionary.getDict('type'),
          dictionary.getDict('repair'),
          dictionary.getDict('condition'),
        ]);

        let dicts = {
          obj: dictsArray[0],
          ret: dictsArray[1],
          type: {
            req: dictsArray[2],
            real: dictsArray[2],
          },
          repair: {type: dictsArray[3]},
          condition: dictsArray[4],
        };
        return dicts;
      },
      async getSettings() {
        // this.settings = await settings.all();
      }
    },
    created() {
      this.loadData({
        model: set,
        infoLoader: this.getInfo,
        dataFetched: this.dataFetched,
        struct,
      });
      // this.getData();
      // this.test('asd');
    }
  };
</script>

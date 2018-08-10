<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Таблица сводных данных</h4>
            </template>
            <template slot="editModal">
                <mdl-dialog :title="editModal && editRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
                    <form v-if="editModal" class="editing-form" action="#" onsubmit="return false;">
                        <input name="_id" v-model="editRow._id" type="hidden"/>
                        <mdl-textfield floating-label="цвет заливки" v-model="editRow.backgroundColor" type="color" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-autocomplete label="в/ч" v-model="editRow.obj" :options="info.obj" :strict="true" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-autocomplete label="дислокация" v-model="editRow.place" :options="info.place" :strict="false" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <!--<mdl-textfield floating-label="дислокация" v-model="editRow.place" class="mdl-textfield--full-width"></mdl-textfield>-->
                        <mdl-select id="editingRet" label="РЭТ" v-model="editRow.ret" :options="info.ret" class="mdl-textfield--full-width"></mdl-select>
                        <mdl-textfield floating-label="наличие пн" v-model="editRow.pn" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-autocomplete id="editingTypeReq" label="тип РЭТ по штату" v-model.lazy="editRow.type.req" :options="info.type.req" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-autocomplete id="editingTypeReal" label="тип РЭТ в наличии" v-model.lazy="editRow.type.real" :options="info.type.real" class="mdl-textfield--full-width"></mdl-autocomplete>
                        <mdl-textfield floating-label="заводской номер" v-model="editRow.serial" class="mdl-textfield--full-width"></mdl-textfield>
                        <mdl-textfield floating-label="год изготовления" v-model="editRow.year" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                        <div class="form-group">
                            <p>вид и год последнего ремонта</p>
                            <div class="form-indent">
                                <mdl-select id="editingRepairType" label="вид" v-model="editRow.repair.type" :options="info.repair.type" class="mdl-textfield--full-width"></mdl-select>
                                <mdl-textfield floating-label="год" v-model="editRow.repair.year" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <mdl-select id="editingCondition" label="состояние РЭТ" v-model="editRow.condition" :options="info.condition" class="mdl-textfield--full-width"></mdl-select>
                        <div class="form-group">
                            <p>отв. за эксплуатацию, уход и сбережение</p>
                            <div class="form-indent">
                                <mdl-textfield floating-label="воинское звание" v-model="editRow.resp.rank" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="ФИО" v-model="editRow.resp.fio" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="приказ о закреплении" v-model="editRow.resp.order" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>установленный ресурс РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield floating-label="ресурс до КР (час.)" v-model="editRow.est.res.kr" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="ресурс до списания (час.)" v-model="editRow.est.res.cancel" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="срок службы до КР (лет)" v-model="editRow.est.life.kr" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="срок службы до списания (лет)" v-model="editRow.est.life.cancel" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>наработка РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield floating-label="наработка с начала эксплуатации (час.)'" v-model="editRow.elabor.elabor.total" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="наработка до КР (час.)" v-model="editRow.elabor.elabor.before" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="наработка после КР (час.)" v-model="editRow.elabor.elabor.after" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="отработано ВСЕГО (лет)" :value="getValue({row: editRow, path: 'elabor.dev.total', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="отработано до КР (лет)" :value="getValue({row: editRow, path: 'elabor.dev.before', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="отработано после КР (лет)" :value="getValue({row: editRow, path: 'elabor.dev.after', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>Запас ресурса образца РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield readonly="" floating-label="до КР (лет)" :value="getValue({row: editRow, path: 'stock.year.kr.num', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (%)" :value="getValue({row: editRow, path: 'stock.year.kr.per', lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (лет)" :value="getValue({row: editRow, path: 'stock.year.cancel.num', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (%)" :value="getValue({row: editRow, path: 'stock.year.cancel.per', lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (час)" :value="getValue({row: editRow, path: 'stock.hour.kr.num', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (%)" :value="getValue({row: editRow, path: 'stock.hour.kr.per', lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (час)" :value="getValue({row: editRow, path: 'stock.hour.cancel.num', lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (%)" :value="getValue({row: editRow, path: 'stock.hour.cancel.per', lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                    </form>
                    <div slot="actions">
                        <mdl-button @click.native="cancelEdit">Отменить</mdl-button>
                        <mdl-button primary="" @click.native="saveEdit">Сохранить</mdl-button>
                    </div>
                </mdl-dialog>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  import set from '~api/set';
  import dictionary from '~api/dictionary';
  import moment from 'moment';
  import filters from '~js/modules/filters';

  let struct =
        [
          {hidden: true, id: "backgroundColor", default: '#ffffff'},
          {id: "obj", title: "в/ч", type: 'select', default: "", filterType: "select"},
          {id: "place", title: "дислокация", type: 'text', default: "", filterType: "select"},
          {id: "ret", title: "РЭТ", type: 'select', default: "РЛС", filterType: "select"},
          {id: "pn", title: "Наличие <br>ПН", type: 'text', default: "", filterType: "select"},
          {
            id: "type", title: "", children:
              [
                {
                  id: "req",
                  title: "Тип РЭТ <br>по штату",
                  type: 'select',
                  default: "",
                  filterType: "select"
                },
                {
                  id: "real",
                  title: "Тип РЭТ <br>в наличии",
                  type: 'text',
                  default: "",
                  filterType: "select"
                },
              ]
          },
          {id: "serial", title: "Заводской <br>номер", type: 'text', default: ""},
          {
            id: "year",
            title: "Год <br>изготовления",
            type: 'number',
            default: 0,
            sortType: "number",
            filterType: "select"
          },
          {
            id: "repair", title: "Вид и год последнего ремонта", children:
              [
                {id: "type", title: "Вид", type: 'select', default: "КР", filterType: "select"},
                {
                  id: "year",
                  title: "Год",
                  type: 'number',
                  default: 0,
                  sortType: "number",
                  filterType: "select"
                },
              ]
          },
          {
            id: "condition",
            title: "Состояние РЭТ",
            type: 'select',
            items: [{name: 'Свернуто', value: 'closed'}, {name: 'Находится в эксплуатации', value: 'in_prod'}],
            default: "in_prod",
            filterType: "select"
          },
          {
            id: "resp", title: "Отв. за эксплуатацию, уход и сбережение", children:
              [
                {id: "rank", title: "В/зв", type: 'text', default: "", filterType: "select"},
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
                        sortType: "number"
                      },
                      {
                        id: "cancel",
                        title: "ресурс до <br>списания (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
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
                        sortType: "number"
                      },
                      {
                        id: "cancel",
                        title: "срок службы <br>до списания (лет)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
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
                        sortType: "number"
                      },
                      {
                        id: "before",
                        title: "наработка до <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                      {
                        id: "after",
                        title: "наработка после <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
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
                        }, default: "", sortType: "number", readonly: true
                      },
                      {
                        id: "before", title: "отработано <br>до КР (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.before = (entity.repair.type === 'КР' ? entity.repair.year : moment().format('YYYY')) - entity.year;
                          return value
                        }, default: "", sortType: "number", readonly: true
                      },
                      {
                        id: "after", title: "отработано <br>после КР (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.after = entity.repair.type === 'КР' ? moment().format('YYYY') - entity.repair.year : 0;
                          return value
                        }, default: "", sortType: "number", readonly: true
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
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.year.kr.per = filters.r1(100 - filters.NaN(entity.elabor.dev.before / entity.est.life.kr * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
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
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.year.cancel.per = filters.r1(100 - filters.NaN(entity.elabor.dev.total / entity.est.life.cancel * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
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
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.kr.per = filters.r1(100 - filters.NaN(entity.elabor.elabor.before / entity.est.res.kr * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
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
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.cancel.per = filters.r1(100 - filters.NaN(entity.elabor.elabor.total / entity.est.res.cancel * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
                            },
                          ]
                      }
                    ]
                },
              ]
          }
        ];


  let options = {
    async created() {
    },
  };

  export default {
    computed: {
      ...mapState('settings', {settings: 'options'}),
      ...mapState('table', ['query', 'rows', 'info', 'loading', 'api', 'options', 'editRow', 'structure', 'editModal']),
      ...mapGetters('table', ['count', 'sortBy', 'sortDirection', 'lastOfGrid']),
    },
    methods: {
      ...mapMutations('table', ['UPDATE_EDIT_ROW']),
      ...mapActions('table', ['loadData', 'saveEdit', 'cancelEdit']),
      async dataFetched({data, all}) {
        data.info.place = [...new Set(all.map(o => (JSON.stringify({value: o.place}))))].map(s => JSON.parse(s));
      },
      async getInfo() {
        let infoArray = await Promise.all([
          dictionary.getDict('obj'),
          dictionary.getDict('ret'),
          dictionary.getDict('type'),
          dictionary.getDict('repair'),
          dictionary.getDict('condition'),
        ]);

        return {
          obj: infoArray[0],
          ret: infoArray[1],
          type: {
            req: infoArray[2],
            real: infoArray[2],
          },
          repair: {type: infoArray[3]},
          condition: infoArray[4],
        };
      },
    },
    created() {
      this.loadData({
        api: set,
        infoLoader: this.getInfo,
        dataFetched: this.dataFetched,
        struct,
        options,
        repairGrid: true,
      }).then(() => {
        for (let row of this.$store.state.table.all) {
          set.update(row)
        }
      });
      // при изменении типа РЭТ по штату менять установленный ресурс РЭТ
      this.$watch('editRow.type.req', (newVal) => {
        if (this.info && this.editRow && this.info.type && this.info.type.req && this.info.type.req.length
          && !this.editRow.est.res.kr && !this.editRow.est.res.cancel && !this.editRow.est.life.kr && !this.editRow.est.life.cancel) {
          let found = this.info.type.req.find(item => (item.name === newVal));
          if (!found)
            return;
          let est = clone(found.est);
          if (est && isObject(est)) {
            this.UPDATE_EDIT_ROW({...this.editRow, est});
            this.$store.dispatch('notify', 'Ресурс РЭТ подставлен');
          }
        }
      });
      // this.getData();
      // this.test('asd');
    },
  };
</script>

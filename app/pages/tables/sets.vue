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
                                <mdl-textfield readonly="" floating-label="отработано ВСЕГО (лет)" :value="getValue({row: editRow, path: 'elabor.dev.total', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="отработано до КР (лет)" :value="getValue({row: editRow, path: 'elabor.dev.before', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="отработано после КР (лет)" :value="getValue({row: editRow, path: 'elabor.dev.after', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
                        <div class="form-group">
                            <p>Запас ресурса образца РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield readonly="" floating-label="до КР (лет)" :value="getValue({row: editRow, path: 'stock.year.kr.num', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (%)" :value="getValue({row: editRow, path: 'stock.year.kr.per', cols: lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (лет)" :value="getValue({row: editRow, path: 'stock.year.cancel.num', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (%)" :value="getValue({row: editRow, path: 'stock.year.cancel.per', cols: lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (час)" :value="getValue({row: editRow, path: 'stock.hour.kr.num', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до КР (%)" :value="getValue({row: editRow, path: 'stock.hour.kr.per', cols: lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (час)" :value="getValue({row: editRow, path: 'stock.hour.cancel.num', cols: lastOfGrid})" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield readonly="" floating-label="до списания (%)" :value="getValue({row: editRow, path: 'stock.hour.cancel.per', cols: lastOfGrid})" type="text" class="mdl-textfield--full-width"></mdl-textfield>
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
  import {isObject, clone} from '~js/helpers';

  let struct = set.struct;


  export default {
    computed: {
      ...mapState('settings', {settings: 'options'}),
      ...mapState('table', ['query', 'rows', 'info', 'loading', 'api', 'options']),
      ...mapState('table/edit', ['editRow', 'editModal']),
      ...mapGetters('table', ['count', 'sortBy', 'sortDirection']),
      ...mapGetters('table/structure', ['lastOfGrid']),
    },
    methods: {
      ...mapMutations('table/edit', ['updateEditRow']),
      ...mapActions('table', ['loadData']),
      ...mapActions('table/edit', ['saveEdit', 'cancelEdit']),
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
      setEst() {
        let found = this.info.type.req.find(item => (item.name === this.editRow.type.req));
        if (!found)
          return;
        let est = clone(found.est);
        if (est && isObject(est)) {
          this.updateEditRow({...this.editRow, est});
          this.$store.dispatch('notify', 'Ресурс РЭТ подставлен');
        }
      },
    },
    async created() {
      await this.loadData({
        api: set,
        infoLoader: this.getInfo,
        dataFetched: this.dataFetched,
        struct,
      });
      // при изменении типа РЭТ по штату менять установленный ресурс РЭТ
      this.$watch('editRow.type.req', () => {
        if (this.info && this.editRow && this.info.type && this.info.type.req && this.info.type.req.length
          && !this.editRow.est.res.kr && !this.editRow.est.res.cancel && !this.editRow.est.life.kr && !this.editRow.est.life.cancel
        ) {
          this.setEst();
        }
      });
    },
  };
</script>

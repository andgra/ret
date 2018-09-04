<template>
    <div class="table-container wide">
        <h4>Итоги эксплуатации</h4>
        <table class="border-all-cells print-table compressed-table">
            <thead class="smaller">
            <tr class="center-all wide-all">
                <th rowspan="2">Наименование</th>
                <th colspan="4">Установленный ресурс</th>
                <th colspan="2">Запас ресурса до КР</th>
                <th colspan="2">Запас ресурса до списания</th>
                <th colspan="2">Запас ресурса до КР</th>
                <th colspan="2">Запас ресурса до списания</th>
            </tr>
            <tr class="center-all wide-all">
                <th>Ресурс до КР (час.)</th>
                <th>Ресурс до списания (час.)</th>
                <th>Срок службы до КР (лет)</th>
                <th>Срок службы до списания (лет)</th>
                <th>лет</th>
                <th>%</th>
                <th>лет</th>
                <th>%</th>
                <th>час</th>
                <th>%</th>
                <th>час</th>
                <th>%</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(row, index) in rows">
                <template v-if="row.empty">
                    <tr class="center-all smaller">
                        <td colspan="13" :style="{height: row.rows+'em'}"></td>
                    </tr>
                </template>
                <template v-else>
                    <tr :data-id="index" class="center-all smaller">
                        <td rowspan="2">{{row.title}}</td>
                        <td>{{row.est.res.kr}}</td>
                        <td>{{row.est.res.cancel}}</td>
                        <td>{{row.est.life.kr}}</td>
                        <td>{{row.est.life.cancel}}</td>
                        <td>{{row.stock.year.kr.num}}</td>
                        <td>{{row.stock.year.kr.per}}%</td>
                        <td>{{row.stock.year.cancel.num}}</td>
                        <td>{{row.stock.year.cancel.per}}%</td>
                        <td>{{row.stock.hour.kr.num}}</td>
                        <td>{{row.stock.hour.kr.per}}%</td>
                        <td>{{row.stock.hour.cancel.num}}</td>
                        <td>{{row.stock.hour.cancel.per}}%</td>
                    </tr>
                    <tr :data-id="index" class="center-all smaller">
                        <td colspan="2">{{row.est.res.total}}</td>
                        <td colspan="2">{{row.est.life.total}}</td>
                        <td colspan="2">{{row.stock.year.total.num}}</td>
                        <td colspan="2">{{row.stock.year.total.per}}%</td>
                        <td colspan="2">{{row.stock.hour.total.num}}</td>
                        <td colspan="2">{{row.stock.hour.total.per}}%</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </table>
    </div>
</template>


<script>
  import set from '~api/set';
  import dictionary from '~api/dictionary';
  import {clone} from '~js/helpers';
  import filters from '~js/modules/filters';


  export default {
    data() {
      return {
        rows: [],
        objects: [],
        total: [],
        pdf_name: 'results',
      }
    },
    computed: {},
    methods: {
      async setRows() {
        let awaited = await Promise.all([
          set.all(),
          dictionary.getDict('ret', {'sort': {'value': 1}}),
          dictionary.getDict('obj', {'sort': {'value': 1}}),
        ]);
        let sets    = awaited[0];
        let retDict = awaited[1];
        let objDict = awaited[2];
        let rows    = [];
        let rowSeed = {
          title: '',
          est: {
            res: {
              kr: 0,
              cancel: 0,
              total: 0
            },
            life: {
              kr: 0,
              cancel: 0,
              total: 0
            },
          },
          elabor: {
            elabor: {
              total: 0,
              before: 0,
              after: 0
            },
            dev: {
              total: 0,
              before: 0,
              after: 0
            },
          },
          stock: {
            year: {
              kr: {
                num: 0,
                per: 0
              },
              cancel: {
                num: 0,
                per: 0
              },
              total: {
                num: 0,
                per: 0
              }
            },
            hour: {
              kr: {
                num: 0,
                per: 0
              },
              cancel: {
                num: 0,
                per: 0
              },
              total: {
                num: 0,
                per: 0
              }
            }
          }
        };
        console.log(sets, retDict, objDict);

        let total            = {total: clone(rowSeed)};
        total['total'].title = 'За соединение';
        rows.push({empty: true, rows: 3});
        rows.push(total['total']);
        for (let ret of retDict) {
          total[ret.value]       = clone(rowSeed);
          total[ret.value].title = ret.value;
          rows.push(total[ret.value]);
        }
        let objects = {}
        for (let obj of objDict) {
          objects[obj.value]                = {total: clone(rowSeed)};
          objects[obj.value]['total'].title = 'За войсковую часть ' + obj.value;
          rows.push({empty: true, rows: 3});
          rows.push(objects[obj.value]['total']);
          for (let ret of retDict) {
            objects[obj.value][ret.value]       = clone(rowSeed);
            objects[obj.value][ret.value].title = ret.value;
            rows.push(objects[obj.value][ret.value]);
          }
        }

        function addSet(target, set) {
          target.est.res.kr += Number(set.est.res.kr);
          target.est.res.cancel += Number(set.est.res.cancel);
          target.est.res.total += Number(set.est.res.kr) + Number(set.est.res.cancel);
          target.est.life.kr += Number(set.est.life.kr);
          target.est.life.cancel += Number(set.est.life.cancel);
          target.est.life.total += Number(set.est.life.kr) + Number(set.est.life.cancel);
          target.elabor.elabor.total += Number(set.elabor.elabor.total);
          target.elabor.elabor.before += Number(set.elabor.elabor.before);
          target.elabor.elabor.after += Number(set.elabor.elabor.after);
          target.elabor.dev.total += Number(set.elabor.dev.total);
          target.elabor.dev.before += Number(set.elabor.dev.before);
          target.elabor.dev.after += Number(set.elabor.dev.after);
        }

        function calculateObj(target) {
          target.stock.year.kr.num     = filters.r0(filters.NaN(target.est.life.kr - target.elabor.dev.before));
          target.stock.year.cancel.num = filters.r0(filters.NaN(target.est.life.cancel - target.elabor.dev.total));
          target.stock.hour.kr.num     = filters.r0(filters.NaN(target.est.res.kr - target.elabor.elabor.before));
          target.stock.hour.cancel.num = filters.r0(filters.NaN(target.est.res.cancel - target.elabor.elabor.total));

          target.stock.year.total.num = target.stock.year.kr.num + target.stock.year.cancel.num;
          target.stock.hour.total.num = target.stock.hour.kr.num + target.stock.hour.cancel.num;

          calculatePers(target);
        }

        function addTotal(total, target) {
          total.est.res.kr += target.est.res.kr;
          total.est.res.cancel += target.est.res.cancel;
          total.est.res.total += target.est.res.total;
          total.est.life.kr += target.est.life.kr;
          total.est.life.cancel += target.est.life.cancel;
          total.est.life.total += target.est.life.total;
          total.stock.year.kr.num += target.stock.year.kr.num;
          total.stock.year.cancel.num += target.stock.year.cancel.num;
          total.stock.hour.kr.num += target.stock.hour.kr.num;
          total.stock.hour.cancel.num += target.stock.hour.cancel.num;

          total.stock.year.total.num += target.stock.year.total.num;
          total.stock.hour.total.num += target.stock.hour.total.num;

        }

        function calculatePers(target) {
          target.stock.year.kr.per     = filters.r0(100 - filters.NaN(target.stock.year.kr.num / target.est.life.kr * 100));
          target.stock.year.cancel.per = filters.r0(100 - filters.NaN(target.stock.year.cancel.num / target.est.life.cancel * 100));
          target.stock.hour.kr.per     = filters.r0(100 - filters.NaN(target.stock.hour.kr.num / target.est.res.kr * 100));
          target.stock.hour.cancel.per = filters.r0(100 - filters.NaN(target.stock.hour.cancel.num / target.est.res.cancel * 100));
          target.stock.year.total.per  = filters.r0(100 - filters.NaN(target.stock.year.total.num / target.est.life.total * 100));
          target.stock.hour.total.per  = filters.r0(100 - filters.NaN(target.stock.hour.total.num / target.est.res.total * 100));
        }

        for (let set of sets) {
          let obj    = set.obj;
          let ret    = set.ret;
          let target = objects[obj][ret];
          addSet(target, set);
        }
        for (let obj of objDict) {
          console.log(objects[obj.value]);
          for (let ret of retDict) {
            let target = objects[obj.value][ret.value];
            calculateObj(target);
            addTotal(objects[obj.value]['total'], target);
            addTotal(total[ret.value], target);

          }
          calculatePers(objects[obj.value]['total']);
          addTotal(total['total'], objects[obj.value]['total']);
        }
        calculatePers(total['total']);
        for (let ret of retDict) {
          calculatePers(total[ret.value]);
        }

        this.rows = rows;

      }
    },
    async created() {
      await this.setRows();
      this.printDataReady();
    }
  };
</script>
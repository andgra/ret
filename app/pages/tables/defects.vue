<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Справка по состоянию РЭТ</h4>
                <h5 class="table-title bordered-top">Сводка невостановленных РЭТ:</h5>
                <div class="table-responsive">
                    <table class="mdl-data-table mdl-js-data-table border-all-cells edited-table wide margin-bot">
                        <tbody>
                        <tr class="center-all">
                            <th class="mdl-data-table__cell--non-numeric"></th>
                            <th class="mdl-data-table__cell--non-numeric">соединение</th>
                            <template v-for="obj in info.obj">
                                <th class="mdl-data-table__cell--non-numeric">в/ч {{obj.value}}</th>
                            </template>
                        </tr>
                        <tr class="center-all">
                            <th class="mdl-data-table__cell--non-numeric">РЭТ, из них:</th>
                            <th class="mdl-data-table__cell--non-numeric">{{stats.total?stats.total.total:''}}</th>
                            <template v-for="obj in info.obj">
                                <td class="mdl-data-table__cell--non-numeric">{{stats[obj.value].total}}</td>
                            </template>
                        </tr>
                        <template v-for="ret in info.ret">
                            <tr class="center-all">
                                <th class="mdl-data-table__cell--non-numeric">{{ret.value}}</th>
                                <td class="mdl-data-table__cell--non-numeric">{{stats.total[ret.value]}}</td>
                                <template v-for="obj in info.obj">
                                    <td class="mdl-data-table__cell--non-numeric">{{stats[obj.value][ret.value]}}</td>
                                </template>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </div>
                <h5 class="table-title bordered-top">Таблица состояний по всем РЭТ:</h5>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import defect from '~api/defect';
  import dictionary from '~api/dictionary';

  let struct = defect.struct;


  export default {
    data() {
      return {
        stats: {},
      };
    },
    computed: {
      ...mapState('table', ['rows', 'info', 'loading', 'all']),
    },
    async created() {
      await this.loadData({
        api: defect,
        infoLoader: this.getInfo,
        dataFetched: this.dataFetched,
        struct,
      });

      this.watchCollection(['all'], () => this.updateStats(this.info, this.all), {deep: true});
    },
    methods: {
      ...mapActions('table', ['loadData']),
      async getInfo() {
        let infoArray = await Promise.all([
          dictionary.getDict('obj', {'sort': {'value': 1}}),
          dictionary.getDict('ret', {'sort': {'value': 1}}),
          dictionary.getDict('type', {'sort': {'value': 1}}),
        ]);

        return {
          obj: infoArray[0],
          ret: infoArray[1],
          type: infoArray[2],
        };
      },

      async dataFetched({data, all}) {
        this.updateStats(data.info, all);
      },

      updateStats(info, all) {
        let stats = {};
        for (let obj of info.obj) {
          stats[obj.value] = {total: 0};
          for (let ret of info.ret) {
            stats[obj.value][ret.value] = 0;
          }
        }
        stats['total'] = {total: 0};
        for (let ret of info.ret) {
          stats['total'][ret.value] = 0;
        }

        for (let obj of info.obj) {
          for (let ret of info.ret) {
            stats[obj.value][ret.value] = all.filter(function (item) {
              return !item.recovery && item.obj === obj.value && item.ret === ret.value;
            }).length;
            stats[obj.value].total += stats[obj.value][ret.value];
          }
        }

        for (let ret of info.ret) {
          stats['total'][ret.value] = 0;
          for (let obj of info.obj) {
            stats['total'][ret.value] += stats[obj.value][ret.value];
          }
          stats['total'].total += stats['total'][ret.value];
        }
        this.stats = stats;
      },
    },
  };
</script>

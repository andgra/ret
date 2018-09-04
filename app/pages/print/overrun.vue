<template>
    <div class="table-container wide">
        <h4>Перерасход РЭТ</h4>
        <table class="border-all-cells print-table compressed-table">
            <thead class="smaller">
            <tr class="center-all wide-all">
                <th rowspan="2">Наименование ВВТ</th>
                <th rowspan="2">Положено (ед.)</th>
                <th colspan="3">Имеется</th>
                <th rowspan="2">Годовой ресурс</th>
                <th rowspan="2">Расход<br>за 1кв. + 2кв.</th>
                <th rowspan="2" width="40px">Расход ресурса</th>
                <th rowspan="2">Вывод</th>
            </tr>
            <tr class="center-all wide-all">
                <th>Всего (ед.)</th>
                <th>В эксплатуации (ед.)</th>
                <th>Не эксплуатируется (ед.)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in allRows" :key="index" :data-id="index" class="center-all smaller" :class="{'text-bold': row.total}">
                <td>{{row.type}}</td>
                <td>{{row.req}}</td>
                <td>{{row.real}}</td>
                <td>{{row.active}}</td>
                <td>{{row.inactive}}</td>
                <td>{{row.yearRes}}</td>
                <td>{{row.consum}}</td>
                <td>{{row.consumRate}}%</td>
                <td>{{row.overrun}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
  import overrun from '~api/overrun';
  import filters from '~js/modules/filters';


  export default {
    data() {
      return {
        rows: [],
        objDict: [],
        retDict: [],
        stats: {},
        pdf_name: 'overrun',
      }
    },
    computed: {
      total() {
        let total = {
          total: true,
          type: "Итого РЭТ:",
          req: 0,
          real: 0,
          active: 0,
          inactive: 0,
          yearRes: 0,
          consum: 0,
        };
        for (let row of this.rows) {
          total.req += Number(row.req);
          total.real += Number(row.real);
          total.active += Number(row.active);
          total.inactive += Number(row.inactive);
          total.yearRes += Number(row.yearRes);
          total.consum += Number(row.consum);
          total.consumRate += Number(row.consumRate);
        }
        total.consumRate = !!total.yearRes ? filters.r0(filters.NaN(total.consum / total.yearRes * 100)) : 0;
        total.overrun    = total.consumRate > 100 ? 'перерасход' : '-';

        return total;
      },
      allRows() {
        return [...this.rows, this.total];
      }
    },
    methods: {},
    async created() {
      this.rows = await overrun.generateData();

      setTimeout(() => this.$emit('printReady', {name: this.pdf_name, el: this.$el}), 0);
    }
  };
</script>
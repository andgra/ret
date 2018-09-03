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
                <th rowspan="2"></th>
            </tr>
            <tr class="center-all wide-all">
                <th>Всего (ед.)</th>
                <th>В эксплатуации (ед.)</th>
                <th>Не эксплуатируется (ед.)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" class="center-all smaller">
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
            <tr class="center-all smaller text-bold">
                <td>{{total.type}}</td>
                <td>{{total.req}}</td>
                <td>{{total.real}}</td>
                <td>{{total.active}}</td>
                <td>{{total.inactive}}</td>
                <td>{{total.yearRes}}</td>
                <td>{{total.consum}}</td>
                <td>{{totalConsumRate}}%</td>
                <td>{{totalOverrun}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
  import set from '~api/set';
  import overrun from '~api/overrun';
  import dictionary from '~api/dictionary';
  import filters from '~js/modules/filters';


  export default {
    data() {
      return {
        rows: [],
        objDict: [],
        retDict: [],
        stats: {},
        pdf_name: 'overrun',
        total: {
          type: "Итого РЭТ:",
          req: 0,
          real: 0,
          active: 0,
          inactive: 0,
          yearRes: 0,
          consum: 0,
        }
      }
    },
    computed: {
      totalConsumRate() {
        return !!this.total.yearRes ? filters.r0(filters.NaN(this.total.consum / this.total.yearRes * 100)) : 0;
      },
      totalOverrun() {
        return this.totalConsumRate > 100 ? 'перерасход' : '-'
      }
    },
    methods: {
      async setRows() {
        let lists     = await Promise.all([
          set.getItems(),
          overrun.getItems(),
          dictionary.getDict('type', {'sort': {'value': 1}})
        ]);
        let sets      = lists[0];
        let dbRows    = lists[1];
        let typesDict = lists[2];
        let types     = {
          all: [],
          req: {},
          real: {},
          active: {},
          inactive: {},
        };

        console.log(1);
        for (let set of sets) {
          if (types.req[set.type.req]) types.req[set.type.req]++;
          else types.req[set.type.req] = 1;

          if (types.real[set.type.real]) types.real[set.type.real]++;
          else types.real[set.type.real] = 1;

          types.all.push(set.type.req);
          types.all.push(set.type.real);

          if (set.condition && set.condition.toLowerCase() == 'свернуто') {
            if (types.inactive[set.type.real]) types.inactive[set.type.real]++;
            else types.inactive[set.type.real] = 1;
          } else {
            if (types.active[set.type.real]) types.active[set.type.real]++;
            else types.active[set.type.real] = 1;
          }
        }
        for (let type of typesDict) {
          types.all.push(type.value);
        }
        types.all = [...new Set(types.all)];
        console.log(types, dbRows, sets);
        let rows = [];
        for (let type of types.all) {
          let dbRow      = dbRows.find(item => (item.type == type));
          let req        = !!types.req[type] ? types.req[type] : 0,
              real       = !!types.real[type] ? types.real[type] : 0,
              active     = !!types.active[type] ? types.active[type] : 0,
              inactive   = !!types.inactive[type] ? types.inactive[type] : 0,
              yearRes    = !!dbRow ? (!!dbRow.yearRes ? dbRow.yearRes : 0) : 0,
              consum     = !!dbRow ? (!!dbRow.consum ? dbRow.consum : 0) : 0,
              consumRate = !!yearRes ? filters.r0(filters.NaN(consum / yearRes * 100)) : 0,
              overrun    = consumRate > 100 ? 'перерасход' : '-';
          rows.push({
            _id: type,
            type,
            req,
            real,
            active,
            inactive,
            yearRes,
            consum,
            consumRate,
            overrun
          });
          this.total.req += Number(req);
          this.total.real += Number(real);
          this.total.active += Number(active);
          this.total.inactive += Number(inactive);
          this.total.yearRes += Number(yearRes);
          this.total.consum += Number(consum);
          this.total.consumRate += Number(consumRate);
        }
        this.rows = rows;


      }
    },
    created() {
      this.setRows().then(() => {
        this.$emit('printReady', {name: this.pdf_name, el: this.$el})
      });
    }
  };
</script>
<template>
    <div class="table-container wide">
        <h4>Таблица контроля работ представителя промышленности</h4>
        <table class="border-all-cells print-table compressed-table">
            <thead>
            <tr class="center-all wide-all">
                <th style="width: 20px">№<br>п/п</th>
                <th>в/ч,<br>подразделение</th>
                <th style="width: 50px">Тип РЭТ,<br>зав. №</th>
                <th>Дата<br>прибытия</th>
                <th>Наименование работ, обслуживаемая система ВВСТ</th>
                <th>Предприятие промышленности</th>
                <th style="width: 40px">Кол-во<br>чел.</th>
                <th style="width: 120px">Старший бригады<br>ФИО, моб. тел.</th>
                <th style="width: 130px">Представитель от<br>в/ч (подразделения)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index">
                <td>{{index + 1}}</td>
                <td>{{row.place}}</td>
                <td>{{row.type}}<br>{{row.zav}}</td>
                <td>{{row.arrival | myDate}}</td>
                <td class="textarea-output">{{row.title}}</td>
                <td>{{row.factory}}</td>
                <td>{{row.people}}</td>
                <td class="textarea-output">{{row.senior}}</td>
                <td>{{row.envoy}}</td>
            </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
  import work from '~api/work';


  export default {
    data() {
      return {
        rows: [],
        pdf_name: 'works',
      }
    },
    methods: {
      async setRows() {
        let awaited = await Promise.all([
          work.all({
            where: {
              $where: function () {
                return !this.departure || this.departure === "";
              }
            }
          }),
        ]);

        this.rows = awaited[0];
      }
    },
    async created() {
      await this.setRows();
      this.printDataReady();
    }
  };
</script>

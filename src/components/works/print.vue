<template>
    <div class="table-container wide">
        <h4>Таблица контроля работ представителя промышленности</h4>
        <table class="border-all-cells print-table">
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
                <td>{{row.arrival}}</td>
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
    import PrintTable from '../mixins/print-table';

    let rowSeed = {
        _id: "",
        place: "",
        type: "",
        zav: "",
        arrival: moment().format('DD.MM.YYYY'),
        title: "",
        factory: "",
        people: 0,
        senior: "",
        envoy: "",
        departure: "",
    };
    let selSeed = recValue(rowSeed, 1);
    selSeed.createdAt = 1;
    selSeed.updatedAt = 1;

    let vm = PrintTable({
        rowSeed,
        selSeed,
        table: 'works',
        pdf_name: 'works',
        setWhere: {
            $where: function() {
                return !this.departure || this.departure==="";
            }
        }
    });

    export default vm;
</script>

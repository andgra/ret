<template>
    <div class="table-container wide">
        <h4>Справка по состоянию РЭТ</h4>
        <table class="border-all-cells print-table margin-bot">
            <tbody>

            <tr class="center-all">
                <th></th>
                <th>в/ч 55555</th>
                <th>в/ч 00000 (Речинск)</th>
                <th>в/ч 11111 (Заречинск)</th>
            </tr>
            <tr class="center-all">
                <th>РЭТ, из них:</th>
                <td>{{stat5}}</td>
                <td>{{stat0}}</td>
                <td>{{stat1}}</td>
            </tr>
            <tr class="center-all">
                <th>РЛС</th>
                <td>{{statRls5}}</td>
                <td>{{statRls0}}</td>
                <td>{{statRls1}}</td>
            </tr>
            <tr class="center-all">
                <th>АСУ</th>
                <td>{{statAsu5}}</td>
                <td>{{statAsu0}}</td>
                <td>{{statAsu1}}</td>
            </tr>
            </tbody>
        </table>
        <table class="border-all-cells print-table">
            <thead>
            <tr class="center-all wide-all">
                <th style="width: 20px">№<br>п/п</th>
                <th>в/ч</th>
                <th>в/ч,<br>дислокация</th>
                <th>РЭТ</th>
                <th style="width: 50px">Тип РЭТ<br>зав. №</th>
                <th>Дата и время<br>отказа</th>
                <th>Неисправная<br>система</th>
                <th style="min-width: 25%">Принимаемые меры</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index">
                <td class="center-text">{{index + 1}}</td>
                <td>{{row.obj}}</td>
                <td>{{row.place}}</td>
                <td>{{getName(retArray,row.ret)}}</td>
                <td class="center-text">{{row.type}}<br>{{row.zav}}</td>
                <td class="center-text">{{row.failure | myDateTime}}</td>
                <td class="center-text">{{row.faulty}}</td>
                <td class="textarea-output">{{row.measures}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
    import PrintTable from '../mixins/print-table';


    let rowSeed = {
        _id: "",
        obj: "",
        place: "",
        ret: "",
        type: "",
        zav: "",
        failure: moment(),
        faulty: "",
        measures: "",
        recovery: "",
        zip: 0,
    };
    let selSeed = recValue(rowSeed, 1);
    selSeed.createdAt = 1;
    selSeed.updatedAt = 1;

    let vm = PrintTable({
        rowSeed,
        selSeed,
        table: 'ret',
        pdf_name: 'ret',
        data: {
            retArray: [{name: 'РЛС', value: 'rls'},{name: 'АСУ', value: 'asu'}],
            statAsu0: 0,
            statAsu1: 0,
            statRls0: 0,
            statRls1: 0,

        },
        computed: {
            statAsu5: function() {
                return this.statAsu0 + this.statAsu1;
            },
            statRls5: function() {
                return this.statRls0 + this.statRls1;
            },
            stat0: function() {
                return this.statAsu0 + this.statRls0;
            },
            stat1: function() {
                return this.statAsu1 + this.statRls1;
            },
            stat5: function() {
                return this.stat0 + this.stat1;
            },
        },
        methods: {
        },
        onSetRows (self) {
            self.statAsu0 = self.rows.filter(function (item) {
                return item.ret === 'asu' && item.obj === '00000';
            }).length;
            self.statAsu1 = self.rows.filter(function (item) {
                return item.ret === 'asu' && item.obj === '11111';
            }).length;
            self.statRls0 = self.rows.filter(function (item) {
                return item.ret === 'rls' && item.obj === '00000';
            }).length;
            self.statRls1 = self.rows.filter(function (item) {
                return item.ret === 'rls' && item.obj === '11111';
            }).length;
        },
        setWhere: {
            $where: function() {
                return !this.recovery || this.recovery==="";
            }
        }
    });

    export default vm;
</script>
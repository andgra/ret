<template>
    <div class="table-container wide">
        <h4>Справка по состоянию РЭТ</h4>
        <table class="border-all-cells print-table margin-bot">
            <tbody>

            <tr class="center-all">
                <th></th>
                <th>всего</th>
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
                <td>{{row.ret}}</td>
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
    import defect from 'models/defect';
    import dictionary from 'models/dictionary';


    export default {
        pdf_name: 'defects',
        data() {
            return {
                rows: [],
                statAsu0: 0,
                statAsu1: 0,
                statRls0: 0,
                statRls1: 0,
            }
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
            async setRows() {
                let awaited = await Promise.all([
                    defect.getPrint(),
                ]);
                let rows = awaited[0];
                console.log(rows);


                this.statAsu0 = rows.filter(function (item) {
                    return item.ret === 'АСУ' && item.obj === '00000';
                }).length;
                this.statAsu1 = rows.filter(function (item) {
                    return item.ret === 'АСУ' && item.obj === '11111';
                }).length;
                this.statRls0 = rows.filter(function (item) {
                    return item.ret === 'РЛС' && item.obj === '00000';
                }).length;
                this.statRls1 = rows.filter(function (item) {
                    return item.ret === 'РЛС' && item.obj === '11111';
                }).length;
                this.rows = rows;



                let dir = ngui.__dirname+'/print';
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                let pdf_path = dir+'/defects.pdf';
                nwin.print({
                    headerFooterEnabled: false,
                    landscape: true,
                    pdf_path
                });
                ngui.Window.open(pdf_path,{ width: 8000,height: 6000,}, function(win) {
                    fs.rmRf(dir);
                });
                nwin.close();
            }
        },
        created() {
            this.setRows();
        }
    };
</script>
<template>
    <div class="table-container wide">
        <h4>Справка по состоянию РЭТ</h4>
        <table class="border-all-cells print-table margin-bot">
            <tbody>

            <tr class="center-all">
                <th></th>
                <th>соединение</th>
                <template v-for="obj in objDict">
                    <th>в/ч {{obj.value}}</th>
                </template>
            </tr>
            <tr class="center-all">
                <th>РЭТ, из них:</th>
                <th>{{stats.total?stats.total.total:''}}</th>
                <template v-for="obj in objDict">
                    <td>{{stats[obj.value].total}}</td>
                </template>
            </tr>
            <template v-for="ret in retDict">
                <tr class="center-all">
                    <th>{{ret.value}}</th>
                    <td>{{stats.total[ret.value]}}</td>
                    <template v-for="obj in objDict">
                        <td>{{stats[obj.value][ret.value]}}</td>
                    </template>
                </tr>
            </template>
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
        data() {
            return {
                rows: [],
                objDict: [],
                retDict: [],
                stats: {},
                pdf_name: 'defects',
            }
        },
        methods: {
            async setRows() {
                let awaited = await Promise.all([
                    defect.getPrint(),
                    dictionary.getDict('ret', {'sort': {'value': 1}}),
                    dictionary.getDict('obj', {'sort': {'value': 1}}),
                ]);
                let rows = awaited[0];
                let retDict = awaited[1];
                let objDict = awaited[2];
                console.log(rows);

                let stats = {}
                for(let obj of objDict) {
                    stats[obj.value] = {total: 0};
                    for(let ret of retDict) {
                        stats[obj.value][ret.value] = 0;
                    }
                }
                stats['total'] = {total: 0};
                for(let ret of retDict) {
                    stats['total'][ret.value] = 0;
                }



                for(let i in objDict) {
                    let obj = objDict[i].value;
                    for(let j in retDict) {
                        let ret = retDict[j].value;
                        stats[obj][ret] = rows.filter(function (item) {
                            return item.obj === obj && item.ret === ret;
                        }).length;
                        stats[obj].total += stats[obj][ret];
                    }
                }

                for(let j in retDict) {
                    let ret = retDict[j].value;
                    stats['total'][ret] = 0;
                    for(let i in objDict) {
                        let obj = objDict[i].value;
                        stats['total'][ret] += stats[obj][ret];
                    }
                    stats['total'].total += stats['total'][ret];
                }

                console.log(stats);

                this.stats = stats;
                this.retDict = retDict;
                this.objDict = objDict;
                this.rows = rows;


                printContent(this.pdf_name);
            }
        },
        created() {
            this.setRows();
        }
    };
</script>
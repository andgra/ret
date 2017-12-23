<template>
    <div class="table-container wide">
        <h4>Итоги эксплатуации</h4>
        <table class="border-all-cells print-table compressed-table">
            <thead>
            <tr class="center-all wide-all">
                <th rowspan="2">Период</th>
                <th rowspan="2">№ в/ч</th>
                <th colspan="2">Количество</th>
                <th colspan="2">Общее время простоя</th>
                <th colspan="2">Среднее время простоя</th>
            </tr>
            <tr class="center-all wide-all smaller">
                <th>Выходов из строя</th>
                <th>Длительных выходов (более 5 сут.)</th>
                <th>С учетом доставки ЗИП</th>
                <th>Без учета доставки ЗИП</th>
                <th>С учетом доставки ЗИП</th>
                <th>Без учета доставки ЗИП</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" class="center-all smaller">
                <td rowspan="3" v-if="index % 3 == 0">{{row.period}}</td>
                <td>{{row.obj}}</td>
                <td>{{row.total}}</td>
                <td>{{row.extended}}</td>
                <td>{{row.timeZip | myInterval}}</td>
                <td>{{row.time | myInterval}}</td>
                <td>{{row.avgTimeZip | myInterval}}</td>
                <td>{{row.avgTime | myInterval}}</td>
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

        },
        computed: {
        },
        methods: {
        },
        init(self) {
            db
                .find({table: 'ret', $where: function() {
                    return this.recovery!==null && this.recovery!==undefined && this.recovery!=="";
                }})
                .exec(function (err, rows) {

                    let year = 2017;

                    let intervals = {
                        '1stQuarter' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment(year+'/04/01','YYYY/MM/DD'), title: 'ИТОГО за 1 квартал '+year+' г.', sort: 1},
                        '2ndQuarter' : {from: moment(year+'/04/01','YYYY/MM/DD'), to: moment(year+'/07/01','YYYY/MM/DD'), title: 'ИТОГО за 2 квартал '+year+' г.', sort: 2},
                        '1stHalf' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment(year+'/07/01','YYYY/MM/DD'), title: 'ИТОГО за 1 полугодие '+year+' г.', sort: 3},
                        '3thQuarter' : {from: moment(year+'/07/01','YYYY/MM/DD'), to: moment(year+'/10/01','YYYY/MM/DD'), title: 'ИТОГО за 3 квартал '+year+' г.', sort: 4},
                        '4thQuarter' : {from: moment(year+'/10/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за 4 квартал '+year+' г.', sort: 5},
                        '2ndHalf' : {from: moment(year+'/07/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за 2 полугодие '+year+' г.', sort: 6},
                        'Year' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за ГОД', sort: 7},
                        'Year1' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за ГОД', sort: 7},
                        'Year2' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за ГОД', sort: 7},
                        'Year3' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за ГОД', sort: 7},
                    };

                    let groups = {};
                    let finalGroups = {};
                    let res = [];

                    for(let name in intervals) {
                        let group = rows.filter(function (item) {
                            return moment(item.failure)>=intervals[name].from && moment(item.failure)<intervals[name].to;
                        });

                        groups[name] = {};
                        finalGroups[name] = {};

                        groups[name].zero = group.filter(function (item) {
                            return item.obj === '00000';
                        });

                        groups[name].one = group.filter(function (item) {
                            return item.obj === '11111';
                        });

                        for(let obj in groups[name]) {
                            finalGroups[name][obj] = {};
                            finalGroups[name][obj].total = groups[name][obj].length;
                            finalGroups[name][obj].extended = groups[name][obj].filter(function (item) {
                                return moment(item.recovery).diff(moment(item.failure), 'days') > 5;
                            }).length;


                            finalGroups[name][obj].timeZip = groups[name][obj].reduce(
                                function (sum, item) {
                                    return sum + moment(item.recovery).diff(moment(item.failure), 'minutes');
                                }, 0
                            );
                            finalGroups[name][obj].time = groups[name][obj].reduce(
                                function (sum, item) {
                                    return sum + (moment(item.recovery).diff(moment(item.failure), 'minutes') - item.zip);
                                }, 0
                            );
                        }

                        finalGroups[name].five = {};
                        finalGroups[name].five.total = finalGroups[name].zero.total+finalGroups[name].one.total;
                        finalGroups[name].five.extended = finalGroups[name].zero.extended+finalGroups[name].one.extended;
                        finalGroups[name].five.timeZip = finalGroups[name].zero.timeZip+finalGroups[name].one.timeZip;
                        finalGroups[name].five.time = finalGroups[name].zero.time+finalGroups[name].one.time;

                        finalGroups[name].zero.obj = '00000';
                        finalGroups[name].one.obj  = '11111';
                        finalGroups[name].five.obj = '55555';
                        for(let obj in finalGroups[name]) {
                            finalGroups[name][obj].avgTimeZip = finalGroups[name][obj].total ? finalGroups[name][obj].timeZip / finalGroups[name][obj].total : 0;
                            finalGroups[name][obj].avgTime = finalGroups[name][obj].total ? finalGroups[name][obj].time / finalGroups[name][obj].total : 0;
                            finalGroups[name][obj].period = intervals[name].title;
                            res.push(finalGroups[name][obj]);
                        }
                    }
                    self.rows = res;
                    let dir = ngui.__dirname+'/print';
                    if (!fs.existsSync(dir)){
                        fs.mkdirSync(dir);
                    }
                    let pdf_path = dir+'/results.pdf';
                    nwin.print({
                        headerFooterEnabled: false,
                        landscape: true,
                        pdf_path
                    });
                    ngui.Window.open(pdf_path,{ width: 8000,height: 6000,}, function(win) {
                        fs.rmRf(dir);
                    });
                    nwin.close();
                });
        },
        setWhere: {
            $where: function() {
                return !this.recovery || this.recovery==="";
            }
        }
    });

    export default vm;
</script>
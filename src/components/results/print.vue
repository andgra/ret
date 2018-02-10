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
    import defect from 'models/defect';
    import settings from 'models/settings';


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


    export default {
        pdf_name: 'results',
        data() {
            return {
                rows: [],
            }
        },
        computed: {
        },
        methods: {
            async setRows() {
                let awaited = await Promise.all([
                    defect.getResults(),
                    settings.all()
                ]);
                let rows = awaited[0];
                let year = awaited[1].resultsYear ? awaited[1].resultsYear : Number(moment().format('YYYY'));
                console.log(rows,year);

                let intervals = {
                    'January' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment(year+'/02/01','YYYY/MM/DD'), title: 'Январь '+year+' г.', sort: 1},
                    'February' : {from: moment(year+'/02/01','YYYY/MM/DD'), to: moment(year+'/03/01','YYYY/MM/DD'), title: 'Февраль '+year+' г.', sort: 1},
                    'March' : {from: moment(year+'/03/01','YYYY/MM/DD'), to: moment(year+'/04/01','YYYY/MM/DD'), title: 'Март '+year+' г.', sort: 1},
                    '1stQuarter' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment(year+'/04/01','YYYY/MM/DD'), title: 'ИТОГО за 1 квартал '+year+' г.', sort: 1},
                    'April' : {from: moment(year+'/04/01','YYYY/MM/DD'), to: moment(year+'/05/01','YYYY/MM/DD'), title: 'Апрель '+year+' г.', sort: 2},
                    'May' : {from: moment(year+'/05/01','YYYY/MM/DD'), to: moment(year+'/06/01','YYYY/MM/DD'), title: 'Май '+year+' г.', sort: 2},
                    'June' : {from: moment(year+'/06/01','YYYY/MM/DD'), to: moment(year+'/07/01','YYYY/MM/DD'), title: 'Июнь '+year+' г.', sort: 2},
                    '2ndQuarter' : {from: moment(year+'/04/01','YYYY/MM/DD'), to: moment(year+'/07/01','YYYY/MM/DD'), title: 'ИТОГО за 2 квартал '+year+' г.', sort: 2},
                    '1stHalf' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment(year+'/07/01','YYYY/MM/DD'), title: 'ИТОГО за 1 полугодие '+year+' г.', sort: 3},
                    'July' : {from: moment(year+'/07/01','YYYY/MM/DD'), to: moment(year+'/08/01','YYYY/MM/DD'), title: 'Июль '+year+' г.', sort: 2},
                    'August' : {from: moment(year+'/08/01','YYYY/MM/DD'), to: moment(year+'/09/01','YYYY/MM/DD'), title: 'Август '+year+' г.', sort: 4},
                    'September' : {from: moment(year+'/09/01','YYYY/MM/DD'), to: moment(year+'/10/01','YYYY/MM/DD'), title: 'Сентябрь '+year+' г.', sort: 4},
                    '3thQuarter' : {from: moment(year+'/07/01','YYYY/MM/DD'), to: moment(year+'/10/01','YYYY/MM/DD'), title: 'ИТОГО за 3 квартал '+year+' г.', sort: 4},
                    'October' : {from: moment(year+'/10/01','YYYY/MM/DD'), to: moment(year+'/11/01','YYYY/MM/DD'), title: 'Октябрь '+year+' г.', sort: 4},
                    'November' : {from: moment(year+'/11/01','YYYY/MM/DD'), to: moment(year+'/12/01','YYYY/MM/DD'), title: 'Ноябрь '+year+' г.', sort: 5},
                    'December' : {from: moment(year+'/12/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'Декабрь '+year+' г.', sort: 5},
                    '4thQuarter' : {from: moment(year+'/10/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за 4 квартал '+year+' г.', sort: 5},
                    '2ndHalf' : {from: moment(year+'/07/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за 2 полугодие '+year+' г.', sort: 6},
                    'Year' : {from: moment(year+'/01/01','YYYY/MM/DD'), to: moment((year+1)+'/01/01','YYYY/MM/DD'), title: 'ИТОГО за ГОД', sort: 7},
                };

                let objects = [];
                for(let row of rows) {
                    objects.push(row.obj);
                }
                objects = [...new Set(objects)];

                let groups = {};
                let finalGroups = {};
                let res = [];

                for(let name in intervals) {
                    let group = rows.filter(function (item) {
                        return moment(item.failure)>=intervals[name].from && moment(item.failure)<intervals[name].to;
                    });

                    groups[name] = {};
                    finalGroups[name] = {};
                    let totalGroup = {
                        obj: 'Всего',
                        total: 0,
                        extended: 0,
                        timeZip: 0,
                        time: 0,
                    };

                    for(let obj of objects) {
                        groups[name][obj] = group.filter(item => ( item.obj === obj ));

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
                        finalGroups[name][obj].obj = obj;
                        totalGroup.total += finalGroups[name][obj].total;
                        totalGroup.extended += finalGroups[name][obj].extended;
                        totalGroup.timeZip += finalGroups[name][obj].timeZip;
                        totalGroup.time += finalGroups[name][obj].time;
                    }

                    finalGroups[name]['total'] = totalGroup;

                    for(let obj in finalGroups[name]) {
                        finalGroups[name][obj].avgTimeZip = finalGroups[name][obj].total ? finalGroups[name][obj].timeZip / finalGroups[name][obj].total : 0;
                        finalGroups[name][obj].avgTime = finalGroups[name][obj].total ? finalGroups[name][obj].time / finalGroups[name][obj].total : 0;
                        finalGroups[name][obj].period = intervals[name].title;
                        res.push(finalGroups[name][obj]);
                    }
                }
                this.rows = res;
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
            }
        },
        created() {
            this.setRows();
        }
    };
</script>
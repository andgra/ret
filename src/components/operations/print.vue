<template>
    <div class="table-container wide">
        <h4>Справка по срокам эксплатуации</h4>
        <table class="border-all-cells print-table compressed-table">
            <thead>
            <tr class="center-all wide-all">
                <th rowspan="3"></th>
                <th colspan="8">ВВСТ по срокам службы</th>
            </tr>
            <tr class="center-all wide-all">
                <th colspan="2">РЭТ всего</th>
                <th :colspan="retDict.length">Соединение</th>
                <template v-for="obj in objDict">
                    <th :colspan="retDict.length">{{obj.value}}</th>
                </template>
            </tr>
            <tr class="center-all wide-all">
                <th>комплектов</th>
                <th>% от общего количества</th>
                <template v-for="ret in retDict">
                    <td>{{ret.value}}</td>
                </template>
                <template v-for="obj in objDict">
                    <template v-for="ret in retDict">
                        <td>{{ret.value}}</td>
                    </template>
                </template>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" class="center-all">
                <td class="right-text">{{row.title}}</td>
                <td>{{row.cnt}}</td>
                <td>{{row.percentage | r0 | per}}</td>
                <template v-for="ret in retDict">
                    <td>{{row.total[ret.value]}}</td>
                </template>
                <template v-for="obj in objDict">
                    <template v-for="ret in retDict">
                        <td>{{row[obj.value][ret.value]}}</td>
                    </template>
                </template>
            </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
    import set from 'models/set';
    import dictionary from 'models/dictionary';


    export default {
        data() {
            return {
                rows: [],
                objDict: [],
                retDict: [],
                pdf_name: 'operations',
            }
        },
        methods: {
            async setRows() {
                let awaited = await Promise.all([
                    set.getOperations(),
                    dictionary.getDict('ret',{'sort':{'value':1}}),
                    dictionary.getDict('obj',{'sort':{'value':1}}),
                ]);
                let rows = awaited[0];
                let retDict = this.retDict = awaited[1];
                let objDict = this.objDict = awaited[2];
                console.log(this);


                let intervals = {
                    'to5' : {from: 0, to: 5, title: 'до 5 лет (0-5)', sort: 1},
                    'to10' : {from: 6, to: 10, title: 'до 10 лет (6-10)', sort: 2},
                    'to15' : {from: 11, to: 15, title: 'до 15 лет (11-15)', sort: 3},
                    'to20' : {from: 16, to: 20, title: 'до 20 лет (16-20)', sort: 4},
                    'from50' : {from: 21, title: 'свыше 20 лет (21 и выше)', sort: 5},
                };

                let groups = {};
                let total = {
                    title: "ИТОГО",
                    cnt: 0,
                    percentage: "",
                };
                console.log(objDict,retDict);
                for(let obj of objDict) {
                    total[obj.value] = {};
                    for(let ret of retDict) {
                        total[obj.value][ret.value] = 0;
                    }
                }
                total['total'] = {};
                for(let ret of retDict) {
                    total['total'][ret.value] = 0;
                }
                let res = [];

                for(let name in intervals) {
                    let group = rows.filter(function (item) {
                        let passed = moment().diff(moment(item.year,'YYYY'),'year')>=intervals[name].from;
                        if(passed && intervals[name].to && moment().diff(moment(item.year,'YYYY'),'year')>intervals[name].to) {
                            passed = false;
                        }
                        return passed;
                    });

                    groups[name] = {};

                    groups[name].title = intervals[name].title;
                    groups[name].cnt = group.length;
                    total.cnt += groups[name].cnt;

                    for(let i in objDict) {
                        let obj = objDict[i].value;
                        groups[name][obj] = {};
                        for(let j in retDict) {
                            let ret = retDict[j].value;
                            groups[name][obj][ret] = group.filter(function (item) {
                                return item.obj === obj && item.ret === ret;
                            }).length;
                            total[obj][ret] += groups[name][obj][ret];
                        }
                    }

                    groups[name]['total'] = {};
                    for(let j in retDict) {
                        let ret = retDict[j].value;
                        groups[name]['total'][ret] = 0;
                        for(let i in objDict) {
                            let obj = objDict[i].value;
                            groups[name]['total'][ret] += groups[name][obj][ret];
                        }
                        total['total'][ret] += groups[name]['total'][ret];
                    }
                }


                for(let name in intervals) {
                    groups[name].percentage = total.cnt ? groups[name].cnt / total.cnt * 100 : 0;
                    res.push(clone(groups[name]));
                }
                res.push(clone(total));

                console.log(res);

                this.rows = res;


                printContent(this.pdf_name);
            }
        },
        created() {
            this.setRows();
        }
    };

</script>
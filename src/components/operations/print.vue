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
                <th colspan="2">55555</th>
                <th colspan="2">00000</th>
                <th colspan="2">11111</th>
            </tr>
            <tr class="center-all wide-all">
                <th>комплектов</th>
                <th>% от общего количества</th>
                <th>АСУ</th>
                <th>РЛС</th>
                <th>АСУ</th>
                <th>РЛС</th>
                <th>АСУ</th>
                <th>РЛС</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="row.num" :data-id="index" class="center-all">
                <td class="right-text">{{row.title}}</td>
                <td>{{row.total}}</td>
                <td>{{row.percentage | r0 | per}}</td>
                <td>{{row.five.asu}}</td>
                <td>{{row.five.rls}}</td>
                <td>{{row.zero.asu}}</td>
                <td>{{row.zero.rls}}</td>
                <td>{{row.one.asu}}</td>
                <td>{{row.one.rls}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
    import PrintTable from '../mixins/print-table';


    let rowSeed = {
        _id: "",
    };
    let selSeed = recValue(rowSeed, 1);
    selSeed.createdAt = 1;
    selSeed.updatedAt = 1;

    let vm = PrintTable({
        rowSeed,
        selSeed,
        table: 'defects',
        pdf_name: 'exploit',
        data: {

        },
        computed: {
        },
        methods: {
        },
        init(self) {
            db
                .find({table: 'sets', $where: function() {
                    return this.year!==null && this.year!==undefined && this.year!=="" && this.year!==0;
                }})
                .exec(function (err, rows) {
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
                        total: 0,
                        percentage: "",
                        zero: {
                            asu: 0,
                            rls: 0
                        },
                        one: {
                            asu: 0,
                            rls: 0
                        },
                        five: {
                            asu: 0,
                            rls: 0
                        }
                    };
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
                        groups[name].total = group.length;
                        total.total += groups[name].total;

                        groups[name].zero = {};
                        groups[name].one = {};
                        groups[name].five = {};
                        groups[name].zero.asu = group.filter(function (item) {
                            return item.obj === '00000' && item.ret === 'asu';
                        }).length;
                        total.zero.asu += groups[name].zero.asu;

                        groups[name].zero.rls = group.filter(function (item) {
                            return item.obj === '00000' && item.ret === 'rls';
                        }).length;
                        total.zero.rls += groups[name].zero.rls;

                        groups[name].one.asu = group.filter(function (item) {
                            return item.obj === '11111' && item.ret === 'asu';
                        }).length;
                        total.one.asu += groups[name].one.asu;

                        groups[name].one.rls = group.filter(function (item) {
                            return item.obj === '11111' && item.ret === 'rls';
                        }).length;
                        total.one.rls += groups[name].one.rls;

                        groups[name].five.asu = groups[name].zero.asu + groups[name].one.asu;
                        total.five.asu += groups[name].five.asu;
                        groups[name].five.rls = groups[name].zero.rls + groups[name].one.rls;
                        total.five.rls += groups[name].five.rls;
                    }


                    for(let name in intervals) {
                        groups[name].percentage = total.total ? groups[name].total / total.total * 100 : 0;
                        res.push(JSON.parse(JSON.stringify(groups[name])));
                    }
                    res.push(JSON.parse(JSON.stringify(total)));

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
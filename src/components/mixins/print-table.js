let Vue = require("vue/dist/vue.js");

export default function (options) {
    return {
        data: function () {
            return Object.assign({
                rows: [],
                sel: JSON.parse(JSON.stringify(options.selSeed)),
            }, options.data || {})
        },
        computed: Object.assign({
            selFooter: function () {
                return this.getSelCnt(options.rowSeed);
            }
        }, options.computed || {}),
        methods: Object.assign({
            getSelCnt: function (arr) {
                arr = JSON.parse(JSON.stringify(arr));
                let res = 0;
                for (let i in arr) {
                    if (isArray(arr[i]) || isObject(arr[i])) {
                        res += this.getSelCnt(arr[i]);
                    } else {
                        res += arr[i];
                    }
                }
                return res;
            },
            getName: function (arr, value) {
                if (!value) {
                    return "";
                }
                let items = arr.filter(function (item) {
                    return item.value == value;
                });
                if (items.length === 0) {
                    return "";
                }
                return items[0].name;
            },
            setRows: function () {
                db
                    .find(Object.assign({table: options.table}, options.setWhere || {}))
                    .sort(Object.assign({createdAt: 1}, options.setSort || {}))
                    .exec($.proxy(function (err, rows) {
                        this.rows = rows;
                        if(options.onSetRows) {
                            options.onSetRows(this);
                        }
                        let dir = ngui.__dirname+'/print';
                        if (!fs.existsSync(dir)){
                            fs.mkdirSync(dir);
                        }
                        let pdf_path = dir+'/'+options.pdf_name+'.pdf';
                        nwin.print({
                            headerFooterEnabled: false,
                            landscape: true,
                            pdf_path
                        });
                        ngui.Window.open(pdf_path,{ width: 8000,height: 6000,}, function(win) {
                            fs.rmRf(dir);
                        });
                        nwin.close();
                    }, this));
            },
        }, options.methods || {}),
        created: function () {
            if(options.init) {
                options.init(this);
            } else {
                this.setRows();
            }
            if(options.created) {
                options.created(this);
            }
        },
        mounted: function () {
            if(options.mounted) {
                options.mounted(this);
            }
        },
    }
};
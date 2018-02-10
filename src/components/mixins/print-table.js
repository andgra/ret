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
        }, options.methods || {}),
        created: function () {
            if(options.init) {
                options.init().call(this);
            } else {
                this.setRows();
            }
            if(options.created) {
                options.created().call(this);
            }
        },
        mounted: function () {
            if(options.mounted) {
                options.mounted().call(this);
            }
        },
    }
};
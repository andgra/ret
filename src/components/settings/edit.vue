<template>

</template>

<script>
    export default {/*
        data() {
            return {
                options,
                settings: {},
                rows: [],
                statAsu0: 0,
                statAsu1: 0,
                statRls0: 0,
                statRls1: 0,
            }
        },
        components: {EditedTable},
        computed: {
            statAsu5: function () {
                return this.statAsu0 + this.statAsu1;
            },
            statRls5: function () {
                return this.statRls0 + this.statRls1;
            },
            stat0: function () {
                return this.statAsu0 + this.statRls0;
            },
            stat1: function () {
                return this.statAsu1 + this.statRls1;
            },
            stat5: function () {
                return this.stat0 + this.stat1;
            },
        },
        methods: {
            getInterval(d1, d2) {
                d1 = moment(d1);
                d2 = moment(d2);
                return d1.diff(d2, 'minutes');
            },
            updateStat() {
                this.statAsu0 = this.rows.filter(function (item) {
                    return item.ret === 'asu' && item.obj === '00000';
                }).length;
                this.statAsu1 = this.rows.filter(function (item) {
                    return item.ret === 'asu' && item.obj === '11111';
                }).length;
                this.statRls0 = this.rows.filter(function (item) {
                    return item.ret === 'rls' && item.obj === '00000';
                }).length;
                this.statRls1 = this.rows.filter(function (item) {
                    return item.ret === 'rls' && item.obj === '11111';
                }).length;
            },
        },
        created() {
            this.watchCollection(['rows'], this.updateStat, {deep: true});
        },
        mounted() {

            $('#testInp').datetimepicker({
                format: 'd.m.Y H:i',
            });
            console.log($('#testInp'));
        }*/
    };
</script>
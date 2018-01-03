<template lang="pug">
    div.table-container
        table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp.border-all-cells.edited-table(data-tablesaw-mode='columntoggle', ref='table')
            thead
                tr
                    th(colspan="3")
                    th(colspan="2") 1
                tr
                    th 2
                    th 3
                    th 4
                    th 5
                    th 6
</template>
<script>

    export default {
        props: {
            options: {
                type: Object,
                default: {},
                required: false
            },

            rows: {
                type: Array,
                default: []
            },
        },
        data: function () {
            let struct = JSON.parse(JSON.stringify(this.options.struct));

            let grid = getGrid(struct);
            console.log('grid', grid);

            let rowSeed = getSeed({children: struct});
            let selSeed = recValue(rowSeed, 1);
            rowSeed._id = "";
            selSeed.createdAt = 1;
            selSeed.updatedAt = 1;
            console.log(rowSeed, selSeed);
            return Object.assign({
                perPage: this.options.perPage || 10,
                page: 1,
                checks: [],
                checkAll: false,
                edit: -1,
                checkAllChanged: false,
                savedRow: null,
                struct,
                grid,
                rowSeed,
                selSeed,
                editingRow: JSON.parse(JSON.stringify(rowSeed)),
                sel: JSON.parse(JSON.stringify(selSeed)),
                toRemove: [],
                tfConf: Object.assign({

                    filters_row_index: 2,
                    paging: {
                        length: 5,
                        toolbar_position: 'left',
                        page_text: 'стр',
                        of_text: ' из ',
                        target_id: 'paging'
                    },
                    clear_filter_text: " ",
                    locale: "ru",
                    refresh_filters: true,
                }, this.options.tfConf || {}),
                tf: null,
            }, this.options.data || {})
        },
        computed: {
            isClosed: function () {
                return this.getSelCnt(this.sel) !== this.getSelCnt(this.options.selSeed)
            },
            maxPage: function () {
                return Math.ceil(this.rows.length / this.perPage) || 1;
            },
            selFooter: function () {
                return 4 + this.getSelCnt(this.options.selSeed) + 2;
            },
            copyRows: function () {
                return JSON.parse(JSON.stringify(this.rows));
            },
        },
        mounted() {
            this.watchCollection(['rows'], () => alert(2))
            this.$parent.testMethod();
        }
    }
</script>
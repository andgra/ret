<template lang="pug">
    div.table-container
        | table
</template>
<script>

    export default options => {
        return {
            data: function () {
                console.log(options);
                return Object.assign({
                    rows: [],
                    sel: JSON.parse(JSON.stringify(options.selSeed)),
                    perPage: options.perPage || 10,
                    page: 1,
                    checks: [],
                    checkAll: false,
                    edit: -1,
                    checkAllChanged: false,
                    savedRow: null,
                    editingRow: JSON.parse(JSON.stringify(options.rowSeed)),
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
                    }, options.tfConf || {}),
                    tf: null,
                }, options.data || {})
            },
            computed: {
                isClosed: function () {
                    return this.getSelCnt(this.sel) !== this.getSelCnt(options.selSeed)
                },
                maxPage: function () {
                    return Math.ceil(this.rows.length / this.perPage) || 1;
                },
                selFooter: function () {
                    return 4 + this.getSelCnt(options.selSeed) + 2;
                },
                copyRows: function () {
                    return JSON.parse(JSON.stringify(this.rows));
                },
            },
            mounted() {
                console.log(this);
            }
        }
    }
</script>
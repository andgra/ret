export default {
  data() {
    return {
      rows: [],
      count: 0,
      dicts: {},
      loaded: false,
      tableLoading: false
    };
  },
  methods: {
    async changeRows() {
      this.tableLoading = true;
      await this.getRows();
      this.tableLoading = false;

    }
  },
  watch: {
  }
};
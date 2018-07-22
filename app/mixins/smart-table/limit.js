export default {
  data() {
    return {
      limit: 10,
    };
  },
  methods: {
  },
  watch: {
    limit() {
      this.page = 1;
      this.changeRows()
    }
  }
}
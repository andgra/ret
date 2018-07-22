export default {
  data() {
    return {
      page: 1,
    };
  },
  methods: {
  },
  watch: {
    page() {
      this.changeRows()
    }
  }
}
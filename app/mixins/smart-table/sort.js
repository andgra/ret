export default {
  data() {
    return {
      sortBy: 'createdAt',
      sortDirection: 1,
    };
  },
  methods: {
  },
  created() {
    this.page = 1;
    this.watchCollection(['sortBy', 'sortDirection'], this.changeRows);
  }
}
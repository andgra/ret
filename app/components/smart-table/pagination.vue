<template>
    <div class="pagination">
        <span><input type="button" value="" @click="firstPage" class="pgInp firstPage" title="Первая страница"></span>
        <span><input type="button" value="" @click="prevPage" class="pgInp previousPage" title="Предыдущая страница"></span>
        <span class="nbpg">стр</span>
        <select class="pgSlc" :value="page" @change="setPage($event.target.value)">
            <option :value="p" v-for="p in (1, maxPage)">{{ p }}</option>
        </select>
        <span class="nbpg"> из </span>
        <span class="nbpg">{{ maxPage }}</span>
        <span><input type="button" value="" @click="nextPage" class="pgInp nextPage" title="Следующая страница"></span>
        <span><input type="button" value="" @click="lastPage" class="pgInp lastPage" title="Последняя страница"></span>
    </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "pagination",
    data: function () {
      return {
        page: this.$store.state.table.query.page,
      };
    },
    computed: {
      ...mapGetters('table', ['maxPage']),
    },
    methods: {
      ...mapActions('table', {storeSetPage: 'setPage'}),
      emitChange(oldPage) {
        if (oldPage !== this.page) {
          this.storeSetPage(this.page);
        }
      },
      setPage(num) {
        let page  = this.page;
        this.page = +num;
        this.emitChange(page);
      },
      firstPage() {
        let page  = this.page;
        this.page = 1;
        this.emitChange(page);
      },
      prevPage() {
        if (this.page < 2) return;
        let page = this.page;
        this.page -= 1;
        this.emitChange(page);
      },
      nextPage() {
        if (this.page > this.maxPage - 1) return;
        let page = this.page;
        this.page += 1;
        this.emitChange(page);
      },
      lastPage() {
        let page  = this.page;
        this.page = this.maxPage;
        this.emitChange(page);
      },
    },
  }
</script>

<style scoped>
    .pagination {
        padding: 3px 0;
    }
</style>
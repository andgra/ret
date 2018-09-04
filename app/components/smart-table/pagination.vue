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
      ...mapGetters('table', {storePage: 'page'}),
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
    watch: {
      storePage(newPage) { this.page = newPage },
    },
  }
</script>

<style scoped>
    .pagination {
        padding: 3px 0;
    }

    select.pgSlc {
        height: 35px;
        margin: 0;
        border: 1px solid #f4f4f4;
        background-color: #fff;
        vertical-align: middle;
    }

    select.pgSlc:focus {
        border-color: #66afe9;
        outline: 0 none;
        box-shadow: 0 1px 1px rgba(0,0,0,0.075) inset, 0 0 8px rgba(102,175,233,0.6);
    }

    input.pgNbInp {
        height: 35px;
        margin: 0;
        border: 1px solid #f4f4f4;
        background-color: #fff;
        width: 35px;
    }

    input.pgNbInp:focus {
        border-color: #66afe9;
        outline: 0 none;
        box-shadow: 0 1px 1px rgba(0,0,0,0.075) inset, 0 0 8px rgba(102,175,233,0.6);
    }

    input.pgInp,
    .nextPage,
    .previousPage,
    .firstPage,
    .lastPage {
        height: 35px;
        margin: 0;
        border: 1px solid #f4f4f4;
        background-color: #fff;
        vertical-align: middle;
        width: 35px;
        border: 0;
        font-weight: bold;
    }

    input.pgInp:focus,
    .nextPage:focus,
    .previousPage:focus,
    .firstPage:focus,
    .lastPage:focus {
        border-color: #66afe9;
        outline: 0 none;
        box-shadow: 0 1px 1px rgba(0,0,0,0.075) inset, 0 0 8px rgba(102,175,233,0.6);
    }

    .nextPage {
        background: transparent url("../../static/images/btn_next_page.gif") center center no-repeat !important;
    }

    .nextPage:hover {
        background-color: #f4f4f4 !important;
    }

    .previousPage {
        background: transparent url("../../static/images/btn_previous_page.gif") center center no-repeat !important;
    }

    .previousPage:hover {
        background-color: #f4f4f4 !important;
    }

    .firstPage {
        background: transparent url("../../static/images/btn_first_page.gif") center center no-repeat !important;
    }

    .firstPage:hover {
        background-color: #f4f4f4 !important;
    }

    .lastPage {
        background: transparent url("../../static/images/btn_last_page.gif") center center no-repeat !important;
    }

    .lastPage:hover {
        background-color: #f4f4f4 !important;
    }

    span.nbpg {
        padding: 0 5px;
    }

    select.rspg {
        height: 35px;
        margin: 0;
        border: 1px solid #f4f4f4;
        background-color: #fff;
        margin: 0 0 0 5px;
        vertical-align: middle;
    }

    select.rspg:focus {
        border-color: #66afe9;
        outline: 0 none;
        box-shadow: 0 1px 1px rgba(0,0,0,0.075) inset, 0 0 8px rgba(102,175,233,0.6);
    }

    span.rspgSpan {
        font-size: inherit;
    }
</style>
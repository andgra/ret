<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Таблица контроля работ представителя промышленности</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  import work from '~api/work';
  import dictionary from '~api/dictionary';

  let struct = work.struct;


  export default {
    computed: {
      ...mapState('table', ['rows', 'info', 'loading']),
    },
    methods: {
      ...mapActions('table', ['loadData']),
      async getInfo() {
        let infoArray = await Promise.all([
          dictionary.getDict('obj'),
          dictionary.getDict('ret'),
          dictionary.getDict('type'),
        ]);

        return {
          obj: infoArray[0],
          ret: infoArray[1],
          type: infoArray[2],
        };
      },
    },
    async created() {
      await this.loadData({
        api: work,
        infoLoader: this.getInfo,
        struct,
      });
    },
  };
</script>

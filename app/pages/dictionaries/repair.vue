<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Типы ремонта</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import dictionary from '~api/dictionary';

  let dictName = 'repair';

  let struct = dictionary.getStruct(dictName);

  export default {
    computed: {
      ...mapState('table', ['rows', 'info', 'loading']),
    },
    methods: {
      ...mapActions('table', ['loadData']),
    },
    async created() {

      await this.loadData({
        api: dictionary,
        struct,
        query: {
          where: {dict: dictName},
        },
      });
    },
  };
</script>

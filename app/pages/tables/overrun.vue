<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Контроль перерасхода</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import overrun from '~api/overrun';
  import filters from '~js/modules/filters';

  let struct = overrun.struct;


  export default {
    computed: {
      ...mapState('table', ['rows', 'info', 'loading']),
    },
    methods: {
      ...mapActions('table', ['loadData']),
    },
    async created() {
      await overrun.generateData();
      
      await this.loadData({
        api: overrun,
        struct,
        options: {
          remove: false,
          dates: false,
        },
      });
    },
  };
</script>

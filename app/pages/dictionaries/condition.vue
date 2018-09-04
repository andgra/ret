<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Состояния РЭТ</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import dictionary from '~api/dictionary';

  let dictName = 'condition';

  let struct =
        [
          {id: "dict", title: " ", type: 'hidden', default: dictName, edit: true, hidden: true},
          {id: "value", title: "Значение", type: 'text', default: ""},
//            {id: "default", title: "Выбрано по умолчанию", type: 'checkbox', default: false},
      ];

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

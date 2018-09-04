<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Типы РЭТ</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
    </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import dictionary from '~api/dictionary';

  let struct =
        [
          {id: "value", title: "Значение", type: 'text', default: ""},
          {
            id: "est", title: "Установленный ресурс РЭТ", children:
              [
                {
                  id: "res", title: "", children:
                    [
                      {id: "kr", title: "ресурс до<br>КР (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                      {id: "cancel", title: "ресурс до<br>списания (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                    ]
                },
                {
                  id: "life", title: "", children:
                    [
                      {id: "kr", title: "срок службы<br>до КР (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                      {id: "cancel", title: "срок службы<br>до списания (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                    ]
                }
              ]
          },
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
          where: {dict: 'type'},
        },
        options: {
          dates: false,
        },
      });
    },
  };
</script>

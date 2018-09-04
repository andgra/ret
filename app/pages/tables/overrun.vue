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

  let struct =
        [
          {hidden: true, id: "backgroundColor", title: "цвет заливки", default: '#ffffff', type: 'color', edit: true},
          {id: "type", title: "Наименование ВВТ", type: 'text', default: "", readonly: true},
          {id: "req", title: "Положено", type: 'text', default: 0, readonly: true},
          {id: "real", title: "Всего имеется", type: 'text', default: 0, readonly: true},
          {id: "active", title: "В эксплатуации", type: 'text', default: 0, readonly: true},
          {id: "inactive", title: "Не эксплотируется", type: 'text', default: 0, readonly: true},
          {id: "yearRes", title: "Годовой ресурс", type: 'text', default: 0},
          {id: "consum", title: "Расход за 1кв. + 2кв.", type: 'text', default: 0},
          {
            id: "consumRate",
            title: "Расход ресурса",
            type: 'text',
            cb(value, entity) {
              value = entity.consumRate = !!entity.yearRes ? filters.r0(filters.NaN(entity.consum / entity.yearRes * 100)) : 0;
              return value
            },
            default: 0,
            readonly: true,
            format: v => (v + '%')
          },
          {
            id: "overrun",
            title: "Вывод",
            type: 'text',
            cb(value, entity) {
              value = entity.overrun = entity.consumRate > 100 ? 'перерасход' : '-';
              return value
            },
            default: "",
            filterType: "select",
            readonly: true
          },
        ];


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

<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Таблица контроля работ представителя промышленности</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
        <!--<EditedTable :options="options" :inRows="rows">-->
        <!--<template slot="editModal" slot-scope="props">-->
        <!--<mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">-->
        <!--<form class="editing-form" action="#" onsubmit="return false;">-->
        <!--<input name="_id" v-model="props.editingRow._id" type="hidden"/>-->
        <!--<mdl-textfield floating-label="цвет заливки" v-model="props.editingRow.backgroundColor" type="color" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
        <!--<mdl-autocomplete label="в/ч" v-model="props.editingRow.obj" :options="props.dicts.obj" :strict="true" class="mdl-textfield&#45;&#45;full-width"></mdl-autocomplete>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="дислокация" v-model="props.editingRow.place"></mdl-textfield>-->
        <!--&lt;!&ndash;<mdl-select class="mdl-textfield&#45;&#45;full-width" id="editingRet" label="РЭТ" v-model="props.editingRow.ret" :options="props.getItems('ret')"></mdl-select>&ndash;&gt;-->
        <!--<mdl-autocomplete id="editingTypeReq" label="тип РЭТ" v-model="props.editingRow.type" :options="props.dicts.type" class="mdl-textfield&#45;&#45;full-width"></mdl-autocomplete>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="зав. №" v-model="props.editingRow.zav"></mdl-textfield>-->
        <!--<DateTimePicker class="mdl-textfield&#45;&#45;full-width" v-model="props.editingRow.arrival" label="Дата прибытия" :time="false"></DateTimePicker>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Наименование работ, обслуживаемая система ВВСТ" v-model="props.editingRow.title" rows="4" :textarea="true" ></mdl-textfield>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Предприятие промышленности" v-model="props.editingRow.factory" ></mdl-textfield>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Кол-во чел." v-model="props.editingRow.people" type="number" ></mdl-textfield>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Старший бригады - ФИО, моб. тел." v-model="props.editingRow.senior" rows="2" :textarea="true" ></mdl-textfield>-->
        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Представитель от в/ч (подразделения)" v-model="props.editingRow.envoy" ></mdl-textfield>-->
        <!--<DateTimePicker class="mdl-textfield&#45;&#45;full-width" v-model="props.editingRow.departure" label="Дата убытия" :time="false"></DateTimePicker>-->
        <!--</form>-->
        <!--<div slot="actions">-->
        <!--<mdl-button @click.native="props.closeEdit()">Отменить</mdl-button>-->
        <!--<mdl-button primary="" @click.native="props.saveRow()">Сохранить</mdl-button>-->
        <!--</div>-->
        <!--</mdl-dialog>-->
        <!--</template>-->
        <!--</EditedTable>-->
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  import work from '~api/work';
  import dictionary from '~api/dictionary';

  let struct =
        [
          {hidden: true, id: "backgroundColor", title: "цвет заливки", default: '#ffffff', type: 'color', edit: true},
          {id: "obj", title: "в/ч", type: 'autocomplete', default: "", filterType: "select"},
          {id: "place", title: "дислокация", type: 'text', default: ""},
//            {id: "ret", title: "РЭТ", type: 'select', items: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}], default: "rls", filterType: "select"},
        {id: "type", title: "Тип РЭТ", type: 'autocomplete', default: "", filterType: "select"},
        {id: "zav", title: "зав. №", type: 'text', default: ""},
        {id: "arrival", title: "Дата прибытия", type: 'date', default: "", sortType: 'date'},
        {id: "title", title: "Наименование работ, <br>обслуживаемая система <br>ВВСТ", type: 'text', default: ""},
        {id: "factory", title: "Предприятие <br>промышленности", type: 'text', default: ""},
        {id: "people", title: "Кол-во <br>чел.", type: 'number', default: 0, sortType: 'number'},
        {id: "senior", title: "Старший бригады <br>ФИО, моб. тел.", type: 'text', default: ""},
        {id: "envoy", title: "Представитель от <br>в/ч (подразделения)", type: 'text', default: ""},
        {id: "departure", title: "Дата <br>убытия", type: 'date', default: "", sortType: 'date'},
      ];


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

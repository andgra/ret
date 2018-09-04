<template>
    <div class="table-container">
        <smart-table v-if="loading < 2">
            <template slot="header">
                <h4 class="table-title">Контроль перерасхода</h4>
            </template>
        </smart-table>
        <loading v-else></loading>
        <!--<EditedTable :options="options" :inRows="rows">-->
            <!--<template slot="editModal" slot-scope="props">-->
                <!--<mdl-dialog ref="editModal" :title="'Редактирование записи'" :noFocusTrap="true">-->
                    <!--<form class="editing-form" action="#" onsubmit="return false;">-->
                        <!--<mdl-textfield floating-label="цвет заливки" v-model="props.editingRow.backgroundColor" type="color" class="mdl-textfield&#45;&#45;full-width"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Наименование ВВТ" :value="props.editingRow.type"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Положено" :value="props.editingRow.req"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Всего имеется" :value="props.editingRow.real"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="В эксплатуации" :value="props.editingRow.active"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Не эксплотируется" :value="props.editingRow.inactive"></mdl-textfield>-->
                        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Годовой ресурс" v-model="props.editingRow.yearRes"></mdl-textfield>-->
                        <!--<mdl-textfield class="mdl-textfield&#45;&#45;full-width" floating-label="Расход за 1кв. + 2кв." v-model="props.editingRow.consum"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label="Расход ресурса, %" :value="props.getValue(props.editingRow, 'consumRate')"></mdl-textfield>-->
                        <!--<mdl-textfield readonly="" class="mdl-textfield&#45;&#45;full-width" floating-label=" " :value="props.getValue(props.editingRow, 'overrun')"></mdl-textfield>-->
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
    import set from '~api/set';
    import overrun from '~api/overrun';
    import dictionary from '~api/dictionary';

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
            {id: "consumRate", title: "Расход ресурса", type: 'text', cb(value,entity) { value = entity.consumRate = !!entity.yearRes ? filters.r0(filters.NaN(entity.consum/entity.yearRes*100)) : 0; return value }, default: 0, readonly: true, format: v=>(v+'%')},
            {id: "overrun", title: " ", type: 'text', cb(value,entity) { value = entity.overrun = entity.consumRate > 100 ? 'перерасход' : '-'; return value }, default: "", filterType: "select", readonly: true},
        ];




    export default {
      computed: {
        ...mapState('table', ['rows', 'info', 'loading']),
      },
      methods: {
        ...mapActions('table', ['loadData']),
        async getInfo() {

          let lists = await Promise.all([
            set.getItems(),
            dictionary.getDict('type', {'sort': {'value': 1}})
          ]);
          this.dicts.sets = lists[0];
          let dbRows = lists[1];
          let typesDict = lists[2];

          let infoArray = await Promise.all([
            set.getItems(),
            overrun.getItems(),
            dictionary.getDict('type'),
          ]);

          return {
            obj: infoArray[0],
            ret: infoArray[1],
            type: infoArray[2],
          };
        },
      },
      created() {
        this.loadData({
          api: overrun,
          infoLoader: this.getInfo,
          struct,
          options: {
            remove: false,
            dates: false,
          },
        }).then(() => {
          for (let row of this.$store.state.table.all) {
            overrun.update(row)
          }
        });
      },
    };

    let options = {
        struct,
        title: 'Контроль перерасхода',
        remove: false,
        dates: false,
        async setRows() {
            let lists = await Promise.all([
                set.getItems(),
                overrun.getItems(),
                dictionary.getDict('type', {'sort': {'value': 1}})
            ]);
            this.dicts.sets = lists[0];
            let dbRows = lists[1];
            let typesDict = lists[2];
            let types = {
                all: [],
                req: {},
                real: {},
                active: {},
                inactive: {},
            };

            for(let set of this.dicts.sets) {
                if(types.req[set.type.req])types.req[set.type.req]++;
                else types.req[set.type.req]=1;

                if(types.real[set.type.real])types.real[set.type.real]++;
                else types.real[set.type.real]=1;

                types.all.push(set.type.req);
                types.all.push(set.type.real);

                if(set.condition && set.condition.toLowerCase() == 'свернуто') {
                    if(types.inactive[set.type.real])types.inactive[set.type.real]++;
                    else types.inactive[set.type.real]=1;
                } else {
                    if(types.active[set.type.real])types.active[set.type.real]++;
                    else types.active[set.type.real]=1;
                }
            }
            for(let type of typesDict) {
                types.all.push(type.value);
            }
            types.all = [...new Set(types.all)];
            let rows = [];
            for(let type of types.all) {
                let dbRow = dbRows.find(item => ( item.type == type ));
                let yearRes = !!dbRow ? (!!dbRow.yearRes ? dbRow.yearRes : 0) : 0,
                    consum = !!dbRow ? (!!dbRow.consum ? dbRow.consum : 0) : 0;
                rows.push({
                    _id: type,
                    type,
                    req: !!types.req[type]?types.req[type]:0,
                    real: !!types.real[type]?types.real[type]:0,
                    active: !!types.active[type]?types.active[type]:0,
                    inactive: !!types.inactive[type]?types.inactive[type]:0,
                    yearRes,
                    consum,
                    consumRate: 0,
                    overrun: ''
                });
            }
            this.rows = rows;
        },
    };
</script>

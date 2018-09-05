import Api from '~api';
import set from '~api/set';
import dictionary from '~api/dictionary';
import filters from '~js/modules/filters';
import db from '~js/db';

let {overrunTable} = db;

class Overrun extends Api {
  constructor() {
    super();
    this.table = overrunTable;
  }

  getItems() {
    return this.all();
  }

  get struct() {
    return [
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
  }

  async generateData() {
    // логика блока: берем типы из словаря (typesDict)
    // для каждого типа считаем кол-во положено, имеется, в эксплатуации и вне
    // из базы берем сохраненные ранее значения (в них может не быть новых типов, потому типы берем из словаря)
    // сливаем значения по ресурсам и расходу из базы overrun с типами из словаря
    // тех типов, что нет в словаре, удаляем из overrun
    // заносим результат в базу для работы smart-table

    // фетчим данные
    let lists     = await Promise.all([
      set.getItems(),
      this.getItems(),
      dictionary.getDict('type', {'sort': {'value': 1}})
    ]);
    let sets      = lists[0];
    let dbRows    = lists[1];
    let typesDict = lists[2];
    let types     = {
      all: [],
      req: {},
      real: {},
      active: {},
      inactive: {},
    };

    // подсчитываем статистику по sets
    for (let set of sets) {
      if (types.req[set.type.req]) types.req[set.type.req]++;
      else types.req[set.type.req] = 1;

      if (types.real[set.type.real]) types.real[set.type.real]++;
      else types.real[set.type.real] = 1;

      types.all.push(set.type.req);
      types.all.push(set.type.real);

      if (set.condition && set.condition.toLowerCase() === 'свернуто') {
        if (types.inactive[set.type.real]) types.inactive[set.type.real]++;
        else types.inactive[set.type.real] = 1;
      } else {
        if (types.active[set.type.real]) types.active[set.type.real]++;
        else types.active[set.type.real] = 1;
      }
    }
    // берем уникальные типы из словаря
    for (let type of typesDict) {
      types.all.push(type.value);
    }
    types.all = [...new Set(types.all)];
    let rows  = [];
    // сливаем данные из словаря и overrun
    for (let type of types.all) {
      let dbRow      = dbRows.find(item => (item.type === type));
      let yearRes    = !!dbRow ? (!!dbRow.yearRes ? dbRow.yearRes : 0) : 0,
          consum     = !!dbRow ? (!!dbRow.consum ? dbRow.consum : 0) : 0,
          consumRate = !!yearRes ? filters.r0(filters.NaN(consum / yearRes * 100)) : 0,
          overrun    = consumRate > 100 ? 'перерасход' : '-';
      rows.push({
        _id: dbRow ? dbRow._id : '',
        type,
        req: !!types.req[type] ? types.req[type] : 0,
        real: !!types.real[type] ? types.real[type] : 0,
        active: !!types.active[type] ? types.active[type] : 0,
        inactive: !!types.inactive[type] ? types.inactive[type] : 0,
        yearRes,
        consum,
        consumRate,
        overrun
      });
    }

    // удаляем несуществующие типы из overrun
    let toDelete = dbRows.filter(item => (types.all.indexOf(item.type) === -1));
    toDelete     = toDelete.map(item => ({_id: item._id}));
    await this.delete({$or: toDelete}, true);

    // обновляем overrun для smart-table
    for (let row of rows) {
      let {doc} = await this.updateOrCreate({_id: row._id}, row);
      row       = doc;
    }

    return rows;
  }
}

export {Overrun};
export default new Overrun;
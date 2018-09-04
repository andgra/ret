import defect from '~api/defect';
import set from '~api/set';
import work from '~api/work';
import dictionary from '~api/dictionary';
import Migration from '~js/modules/migration';
import {sanitize} from '~js/helpers';
import Structure from '~js/modules/structure';

async function sanitizeDefects() {
  let struct =
        [
          {hidden: true, id: "backgroundColor", title: "цвет заливки", default: '#ffffff', type: 'color', edit: true},
          {id: "obj", title: "в/ч", type: 'autocomplete', default: "", filterType: "select"},
          {id: "place", title: "дислокация", type: 'text', default: ""},
          {
            id: "ret",
            title: "РЭТ",
            type: 'select',
            items: [{name: 'РЛС', value: 'rls'}, {name: 'АСУ', value: 'asu'}],
            default: "rls",
            filterType: "select"
          },
          {id: "type", title: "Тип РЭТ", type: 'autocomplete', default: "", filterType: "select"},
          {id: "zav", title: "зав. №", type: 'text', default: ""},
          {id: "failure", title: "дата и время <br>отказа", type: 'datetime', default: "", sortType: 'date'},
          {id: "faulty", title: "неисправная <br>система", type: 'text', default: ""},
          {id: "measures", title: "принимаемые меры", type: 'text', default: ""},
          {id: "recovery", title: "дата и время <br>восстановления", type: 'datetime', default: "", sortType: 'date'},
          {id: "zip", title: "Время доставки <br>ЗИП", type: 'interval', default: 0, width: 150, sortType: 'number'},
        ];

  let structure = new Structure(struct);

  let items = await defect.all();
  let todo = [];
  for (let item of items) {
    todo.push(defect.update(sanitize(item, structure.dots)));
  }
  await Promise.all(todo);
}

async function sanitizeWorks() {
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

  let structure = new Structure(struct);

  let items = await work.all();
  let todo = [];
  for (let item of items) {
    todo.push(work.update(sanitize(item, structure.dots)));
  }
  await Promise.all(todo);
}

async function sanitizeSets() {
  let struct =
        [
          {hidden: true, id: "backgroundColor", title: "цвет заливки", default: '#ffffff', type: 'color', edit: true},
          {id: "obj", title: "в/ч", type: 'autocomplete', default: "", filterType: "select", strict: true},
          {id: "place", title: "дислокация", type: 'text', default: "", filterType: "select"},
          {id: "ret", title: "РЭТ", type: 'autocomplete', default: "РЛС", filterType: "select"},
          {id: "pn", title: "Наличие <br>ПН", type: 'text', default: "", filterType: "select"},
          {
            id: "type", title: "", children:
              [
                {
                  id: "req",
                  title: "Тип РЭТ <br>по штату",
                  type: 'autocomplete',
                  default: "",
                  filterType: "select"
                },
                {
                  id: "real",
                  title: "Тип РЭТ <br>в наличии",
                  type: 'autocomplete',
                  default: "",
                  filterType: "select"
                },
              ]
          },
          {id: "serial", title: "Заводской <br>номер", type: 'text', default: ""},
          {
            id: "year",
            title: "Год <br>изготовления",
            type: 'number',
            default: 0,
            sortType: "number",
            filterType: "select"
          },
          {
            id: "repair", title: "Вид и год последнего ремонта", children:
              [
                {id: "type", title: "Вид", type: 'select', default: "КР", filterType: "select"},
                {
                  id: "year",
                  title: "Год",
                  type: 'number',
                  default: 0,
                  sortType: "number",
                  filterType: "select"
                },
              ]
          },
          {
            id: "condition",
            title: "Состояние РЭТ",
            type: 'select',
            items: [{name: 'Свернуто', value: 'closed'}, {name: 'Находится в эксплуатации', value: 'in_prod'}],
            default: "in_prod",
            filterType: "select"
          },
          {
            id: "resp", title: "Отв. за эксплуатацию, уход и сбережение", children:
              [
                {id: "rank", title: "В/зв", type: 'text', default: "", filterType: "select"},
                {id: "fio", title: "Ф.И.О.", type: 'text', default: ""},
                {id: "order", title: "Пр. о закреплении", type: 'text', default: ""},
              ]
          },
          {
            id: "est", title: "Установленный ресурс РЭТ", children:
              [
                {
                  id: "res", title: "", children:
                    [
                      {
                        id: "kr",
                        title: "ресурс до <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                      {
                        id: "cancel",
                        title: "ресурс до <br>списания (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                    ]
                },
                {
                  id: "life", title: "", children:
                    [
                      {
                        id: "kr",
                        title: "срок службы <br>до КР (лет)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                      {
                        id: "cancel",
                        title: "срок службы <br>до списания (лет)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                    ]
                }
              ]
          },
          {
            id: "elabor", title: "Наработка РЭТ", children:
              [
                {
                  id: "elabor", title: "", children:
                    [
                      {
                        id: "total",
                        title: "наработка с начала <br>эксплуатации (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                      {
                        id: "before",
                        title: "наработка до <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                      {
                        id: "after",
                        title: "наработка после <br>КР (час.)",
                        type: 'number',
                        default: 0,
                        sortType: "number"
                      },
                    ]
                },
                {
                  id: "dev", title: "", children:
                    [
                      {
                        id: "total", title: "отработано <br>ВСЕГО (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.total = moment().format('YYYY') - entity.year;
                          return value
                        }, default: "", sortType: "number", readonly: true
                      },
                      {
                        id: "before", title: "отработано <br>до КР (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.before = (entity.repair.type === 'КР' ? entity.repair.year : moment().format('YYYY')) - entity.year;
                          return value
                        }, default: "", sortType: "number", readonly: true
                      },
                      {
                        id: "after", title: "отработано <br>после КР (лет)", type: 'number', cb(value, entity) {
                          value = entity.elabor.dev.after = entity.repair.type === 'КР' ? moment().format('YYYY') - entity.repair.year : 0;
                          return value
                        }, default: "", sortType: "number", readonly: true
                      },
                    ]
                }
              ]
          },
          {
            id: "stock", title: "Запас ресурса образца РЭТ", children:
              [
                {
                  id: "year", title: "", children:
                    [
                      {
                        id: "kr", title: "Запас ресурса до КР", children:
                          [
                            {
                              id: "num", title: "лет", type: 'text', cb(value, entity) {
                                value = entity.stock.year.kr.num = filters.r1(filters.NaN(entity.est.life.kr - entity.elabor.dev.before));
                                return value
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.year.kr.per = filters.r1(100 - filters.NaN(entity.elabor.dev.before / entity.est.life.kr * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
                            },
                          ]
                      },
                      {
                        id: "cancel", title: "Запас ресурса до списания", children:
                          [
                            {
                              id: "num", title: "лет", type: 'text', cb(value, entity) {
                                value = entity.stock.year.cancel.num = filters.r1(filters.NaN(entity.est.life.cancel - entity.elabor.dev.total));
                                return value
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.year.cancel.per = filters.r1(100 - filters.NaN(entity.elabor.dev.total / entity.est.life.cancel * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
                            },
                          ]
                      }
                    ]
                },
                {
                  id: "hour", title: "", children:
                    [
                      {
                        id: "kr", title: "Запас ресурса до КР", children:
                          [
                            {
                              id: "num", title: "час", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.kr.num = filters.r1(filters.NaN(entity.est.res.kr - entity.elabor.elabor.before));
                                return value
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.kr.per = filters.r1(100 - filters.NaN(entity.elabor.elabor.before / entity.est.res.kr * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
                            },
                          ]
                      },
                      {
                        id: "cancel", title: "Запас ресурса до списания", children:
                          [
                            {
                              id: "num", title: "час", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.cancel.num = filters.r1(filters.NaN(entity.est.res.cancel - entity.elabor.elabor.total));
                                return value
                              }, default: "", sortType: "number", readonly: true
                            },
                            {
                              id: "per", title: "%", type: 'text', cb(value, entity) {
                                value = entity.stock.hour.cancel.per = filters.r1(100 - filters.NaN(entity.elabor.elabor.total / entity.est.res.cancel * 100));
                                return value
                              }, default: "", sortType: "number", readonly: true, format: v => (v + '%')
                            },
                          ]
                      }
                    ]
                },
              ]
          }
        ];

  let structure = new Structure(struct);

  let items = await set.all();
  let todo = [];
  for (let item of items) {
    todo.push(set.update(sanitize(item, structure.dots)));
  }
  await Promise.all(todo);
}

let migration = new Migration({
  async up() {
    await Promise.all([
      sanitizeDefects(),
      sanitizeWorks(),
      sanitizeSets(),
    ]);
  },
});

export default migration;

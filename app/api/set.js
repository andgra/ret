import Api from '~api';
import db from '~js/db';
import moment from 'moment';
import filters from '~js/modules/filters';
let {setTable} = db;

class Set extends Api {
  constructor() {
    super();
    this.table = setTable;
  }

  getItems(filter) {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          if (!filter || !filter.startDate)
            return true;
          return moment(this.createdAt) > moment(filter.startDate, "DD.MM.YYYY");
        }
      }).sort({createdAt: 1}).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }

  getOperations() {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          return this.year !== null && this.year !== undefined && this.year !== "" && this.year !== 0;
        }
      }).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }

  get struct() {
    return [
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
  }
}

export {Set};
export default new Set;
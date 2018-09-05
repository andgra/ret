import Api from '~api';
import db from '~js/db';
let {defectTable} = db;

class Defect extends Api {
  constructor() {
    super();
    this.table = defectTable;
  }

  getItems() {
    return this.all();
  }

  getResults() {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          return this.recovery !== null && this.recovery !== undefined && this.recovery !== "";
        }
      }).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }

  getPrint() {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          return !this.recovery || this.recovery === "";
        }
      }).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }

  get struct() {
    return [
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
  }
}

export {Defect};
export default new Defect;
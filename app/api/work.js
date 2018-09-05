import Api from '~api';
import db from '~js/db';
let {workTable} = db;

class Work extends Api{
    constructor() {
        super();
        this.table = workTable;
    }
    getItems() {
        return this.all();
    }
    getPrint() {
        return new Promise((resolve, reject) => {
            this.table.find({
                $where: function () {
                    return !this.departure || this.departure==="";
                }
            }).exec((err, rows) => !err ? resolve(rows) : reject(err));
        });
    }

    get struct() {
        return [
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
    }
}

export {Work};
export default new Work;
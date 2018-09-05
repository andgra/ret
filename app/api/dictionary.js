import Api from '~api';
import db from '~js/db';

let {dictionaryTable} = db;

class Dictionary extends Api {
  constructor() {
    super();
    this.table = dictionaryTable;
  }

  getDict(name, options = {}) {
    return new Promise((resolve, reject) => {
      options.where = {...options.where, ...{dict: name}};
      this.all(options).then(items => resolve(items)).catch(err => reject(err));
    });
  }

  saveToDict(name, attributes, item) {
    return new Promise((resolve, reject) => {
      this.updateOrCreate({...attributes, ...{dict: name}}, Object.assign(item, {dict: name})).then(
        ({insert, doc}) => {
          resolve({insert, doc})
        },
        err => reject(err)
      );
    });
  }

  getStruct(dictName) {
    return [
      {id: "dict", title: " ", type: 'hidden', default: dictName, edit: true, hidden: true},
      {id: "value", title: "Значение", type: 'text', default: ""},
//            {id: "default", title: "Выбрано по умолчанию", type: 'checkbox', default: false},
    ];
  }

  getTypeStruct(dictName) {
    return [...this.getStruct(dictName), {
      id: "est", title: "Установленный ресурс РЭТ", children:
        [
          {
            id: "res", title: "", children:
              [
                {id: "kr", title: "ресурс до<br>КР (час.)", type: 'number', default: 0, sortType: 'number'},
                {id: "cancel", title: "ресурс до<br>списания (час.)", type: 'number', default: 0, sortType: 'number'},
              ]
          },
          {
            id: "life", title: "", children:
              [
                {id: "kr", title: "срок службы<br>до КР (лет)", type: 'number', default: 0, sortType: 'number'},
                {
                  id: "cancel",
                  title: "срок службы<br>до списания (лет)",
                  type: 'number',
                  default: 0,
                  sortType: 'number'
                },
              ]
          }
        ]
    }];
  }
}

export {Dictionary};
export default new Dictionary;
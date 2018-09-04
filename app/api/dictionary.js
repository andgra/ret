import api from '~api';
import db from '~js/db';
let {dictionaryTable} = db;

class dictionary extends api {
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
}

export {dictionary};
export default new dictionary;
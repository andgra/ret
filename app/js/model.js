const Datastore = require('nedb');


class model {
  constructor() {
    this.table = 'db';
  }

  all(options) {
    let defaultOptions = {
      sort: {createdAt: 1},
      where: {},
      limit: 10,
      page: 1
    };

    options = {...defaultOptions, ...options};

    let {sort, where, limit, page} = options;

    let skip = (page - 1) * limit;

    return new Promise((resolve, reject) => {
      this.table.find(where).sort(sort).skip(skip).limit(limit)
          .exec((err, item) => !err ? resolve(item) : reject(err));
    });
  }

  count(where = {}) {
    return new Promise((resolve, reject) => {
      this.table.count(where).exec((err, item) => !err ? resolve(item) : reject(err));
    });
  }

  update(item) {
    return new Promise((resolve, reject) => {
      this.table.update({_id: item._id}, {$set: item}, (err, item) => !err ? resolve(item) : reject(err));
    });
  }

  insert(item) {
    return new Promise((resolve, reject) => {
      this.table.insert(item, (err, item) => !err ? resolve(item) : reject(err));
    });
  }

  delete(attributes, multi = false) {
    if (!isObject(attributes)) {
      attributes = {_id: attributes};
    }
    return new Promise((resolve, reject) => {
      this.table.remove(attributes, {multi}, (err, item) => !err ? resolve(item) : reject(err));
    });
  }

  firstOrNew(attributes, item) {
    return new Promise((resolve, reject) => {
      this.table.findOne(attributes, (err, doc) => {
        if (err) {
          reject(err);
        } else if (doc) {
          resolve({insert: false, doc});
        } else {
          delete item._id;
          this.insert(item).then(doc => resolve({insert: true, doc}), err => reject(err));
        }
      })
    });
  }

  // Приведение типов перед добавлением в базу
  sanitize(item) {
    return item;
  }

  updateOrCreate(attributes, item) {
    return new Promise((resolve, reject) => {
      delete item._id;
      console.log(attributes, item, this.sanitize(item));
      this.table.update(attributes, this.sanitize(item), {upsert: true, returnUpdatedDocs: true}, (err, num, doc, insert) => {
        !err ? resolve({insert, doc}) : reject(err)
      });
    });
  }
}

export {model};

let tables = ['db', 'sets', 'works']

let loadTable         = name => (new Datastore({
  filename: window.__dirname + '/database/' + name + '.json',
  timestampData: true,
  autoload: true
}));

const db              = loadTable('db');
const setTable        = loadTable('sets');
const workTable       = loadTable('works');
const defectTable     = loadTable('defects');
const overrunTable    = loadTable('overrun');
const settingsTable   = loadTable('settings');
const dictionaryTable = loadTable('dictionaries');
export {db, setTable, workTable, defectTable, overrunTable, settingsTable, dictionaryTable};
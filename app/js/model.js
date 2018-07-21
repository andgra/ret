const Datastore = require('nedb');


class model {
    constructor() {
        this.table = 'db';
    }
    all(desc = false) {
        return new Promise((resolve, reject) => {
            this.table.find({}).sort({createdAt: desc ? -1 : 1 }).exec((err, item) =>  !err ? resolve(item) : reject(err));
        });
    }
    update(item) {
        return new Promise((resolve, reject) => {
            this.table.update({ _id: item._id }, {$set: item}, (err, item) =>  !err ? resolve(item) : reject(err));
        });
    }
    insert(item) {
        return new Promise((resolve, reject) => {
            this.table.insert(item, (err, item) =>  !err ? resolve(item) : reject(err));
        });
    }
    delete(attributes) {
        if(!isObject(attributes)) {
            attributes = { _id: attributes};
        }
        return new Promise((resolve, reject) => {
            this.table.remove(attributes, (err, item) =>  !err ? resolve(item) : reject(err));
        });
    }
    firstOrNew(attributes, item) {
        return new Promise((resolve, reject) => {
            this.table.findOne(attributes, (err, doc) => {
                if(err) {
                    reject(err);
                } else if(doc) {
                    resolve({insert: false, doc});
                } else {
                    delete item._id;
                    this.insert(item).then( doc => resolve({insert: true, doc}), err => reject(err) );
                }
            })
        });
    }
    updateOrCreate(attributes, item) {
        return new Promise((resolve, reject) => {
            delete item._id;
            this.table.update(attributes, item, {upsert: true, returnUpdatedDocs: true}, (err,num,doc,insert) => {
                !err ? resolve({insert,doc}) : reject(err)
            } );
        });
    }
}
export {model};

let tables = ['db','sets','works']

let loadTable = name => (new Datastore({filename: window.__dirname + '/database/'+name+'.json', timestampData: true, autoload: true}));
const db = loadTable('db');
const setTable = loadTable('sets');
const workTable = loadTable('works');
const defectTable = loadTable('defects');
const overrunTable = loadTable('overrun');
const settingsTable = loadTable('settings');
const dictionaryTable = loadTable('dictionaries');
export {db,setTable,workTable,defectTable,overrunTable,settingsTable,dictionaryTable};
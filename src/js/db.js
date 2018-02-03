const Datastore = require('nedb');


export const crudGenerator = (table) => {
    return {
        all(desc = false) {
            return new Promise((resolve, reject) => {
                table.find({}).sort({createdAt: desc ? -1 : 1 }).exec((err, item) =>  !err ? resolve(item) : reject(err));
            });
        },
        update(item) {
            return new Promise((resolve, reject) => {
                table.update({ _id: item._id }, {$set: item}, (err, item) =>  !err ? resolve(item) : reject(err));
            });
        },
        insert(item) {
            return new Promise((resolve, reject) => {
                table.insert(item, (err, item) =>  !err ? resolve(item) : reject(err));
            });
        },
        delete(id) {
            return new Promise((resolve, reject) => {
                table.remove({ _id: id }, (err, item) =>  !err ? resolve(item) : reject(err));
            });
        },
        updateOrCreate(item) {
            return new Promise((resolve, reject) => {
                if(!item._id) {
                    delete item._id;
                    this.insert(item).then(
                        newItem => { resolve({ insert: true, update: false, newItem}) },
                        err => { reject({ insert: true, update: false, err}) }
                    );
                } else {
                    this.update(item).then(
                        newItem => { resolve({ insert: false, update: true, newItem}) },
                        err => { reject({ insert: false, update: true, err}) }
                    );
                }
            });
        }
    }
};
export const db = new Datastore({filename: window.__dirname + '/database/db.json', timestampData: true, autoload: true});
export const setTable = new Datastore({filename: window.__dirname + '/database/sets.json', timestampData: true, autoload: true});
export const workTable = new Datastore({filename: window.__dirname + '/database/works.json', timestampData: true, autoload: true});
export const defectTable = new Datastore({filename: window.__dirname + '/database/defects.json', timestampData: true, autoload: true});
export const settingsTable = new Datastore({filename: window.__dirname + '/database/settings.json', timestampData: true, autoload: true});
export const dictionaryTable = new Datastore({filename: window.__dirname + '/database/dictionaries.json', timestampData: true, autoload: true});
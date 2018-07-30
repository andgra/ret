import api from '~api';
import {dictionaryTable} from '~js/db';

class dictionary extends api {
    constructor() {
        super();
        this.table = dictionaryTable;
    }
    getDict(name,options) {
        return new Promise((resolve, reject) => {
            let query = this.table.find({dict: name});
            if(options && options.sort) {
                query = query.sort(options.sort);
            } else {
                query = query.sort({createdAt: 1 });
            }
            query.exec((err, items) =>  !err ? resolve(items) : reject(err));
        });
    }
    saveToDict(name, attributes, item) {
        return new Promise((resolve, reject) => {
            this.updateOrCreate(Object.assign(attributes, {dict:name}),Object.assign(item, {dict:name})).then(
                ({insert,doc}) => {
                    resolve({insert, doc})
                },
                err => reject(err)
            );
        });
    }
}

export {dictionary};
export default new dictionary;
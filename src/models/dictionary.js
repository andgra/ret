import { model, dictionaryTable } from 'core/model';

let dict1 = {_id: "AsDGf123FD32g32", dict: 'condition', name: "работает", value:"работает"};
let dict2 = {_id: "AsDGf123FD32g32", dict: 'condition', name: "не работает", value:"не работает"};

class settings extends model{
    constructor() {
        super();
        this.table = dictionaryTable;
    }
    getDict(name) {
        return new Promise((resolve, reject) => {
            this.table.find({dict: name}).sort({createdAt: 1 }).exec((err, items) =>  !err ? resolve(items) : reject(err));
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

export {settings};
export default new settings;
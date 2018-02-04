import { model, settingsTable } from 'core/model';

class settings extends model{
    constructor() {
        super();
        this.table = settingsTable;
    }
    get startDate() {
        return new Promise((resolve, reject) => {
            this.table.findOne({key: 'startDate'}, (err, res) =>  !err ? resolve(res) : reject(err));
        });
    }
    set startDate(value) {
        return new Promise((resolve, reject) => {
            this.startDate.then(doc => {
                if(doc) {
                    this.table.update({ key: 'startDate' }, {$set: {value: value}}, (err, item) =>  !err ? resolve(item) : reject(err));
                } else {
                    this.table.insert({ key: 'startDate' ,value: value}, (err, item) =>  !err ? resolve(item) : reject(err));
                }
            })
        });
    }
}

export {settings};
export default new settings;
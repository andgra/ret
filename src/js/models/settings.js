import { crudGenerator, settingsTable } from '../db.js';

export default Object.assign(crudGenerator(settingsTable), {
    get startDate() {
        return new Promise((resolve, reject) => {
            settingsTable.findOne({key: 'startDate'}, (err, res) =>  !err ? resolve(res) : reject(err));
        });
    },
    set startDate(value) {
        return new Promise((resolve, reject) => {
            this.startDate.then(doc => {
                if(doc) {
                    settingsTable.update({ key: 'startDate' }, {$set: {value: value}}, (err, item) =>  !err ? resolve(item) : reject(err));
                } else {
                    settingsTable.insert({ key: 'startDate' ,value: value}, (err, item) =>  !err ? resolve(item) : reject(err));
                }
            })
        });
    }
});
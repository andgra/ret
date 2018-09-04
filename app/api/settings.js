import Api from '~api';
import db from '~js/db';
let {settingsTable} = db;

class Settings extends Api {
  constructor() {
    super();
    this.table = settingsTable;
  }

  get startDate() {
    return new Promise((resolve, reject) => {
      this.table.findOne({key: 'startDate'}, (err, res) => !err ? resolve(res) : reject(err));
    });
  }

  set startDate(value) {
    return new Promise((resolve, reject) => {
      this.startDate.then(doc => {
        if (doc) {
          this.table.update({key: 'startDate'}, {$set: {value: value}}, (err, item) => !err ? resolve(item) : reject(err));
        } else {
          this.table.insert({key: 'startDate', value: value}, (err, item) => !err ? resolve(item) : reject(err));
        }
      })
    });
  }

  async saveAll(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.updateOrCreate({key}, {key, value: obj[key]});
      }
    }
  }

  async all() {
    return new Promise((resolve, reject) => {
      this.table.find({}).exec((err, items) => {
        if (!err) {
          let res = {};
          for (let setting of items) {
            res[setting.key] = setting.value;
          }
          resolve(res);
        } else reject(err);
      });
    });
  }
}

export {Settings};
export default new Settings;
import Api from '~api';
import db from '~js/db';
let {defectTable} = db;

class Defect extends Api {
  constructor() {
    super();
    this.table = defectTable;
  }

  getItems() {
    return this.all();
  }

  getResults() {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          return this.recovery !== null && this.recovery !== undefined && this.recovery !== "";
        }
      }).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }

  getPrint() {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          return !this.recovery || this.recovery === "";
        }
      }).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }
}

export {Defect};
export default new Defect;
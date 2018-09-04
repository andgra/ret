import Api from '~api';
import db from '~js/db';
let {setTable} = db;

class Set extends Api {
  constructor() {
    super();
    this.table = setTable;
  }

  getItems(filter) {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          if (!filter || !filter.startDate)
            return true;
          return moment(this.createdAt) > moment(filter.startDate, "DD.MM.YYYY");
        }
      }).sort({createdAt: 1}).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }

  getOperations() {
    return new Promise((resolve, reject) => {
      this.table.find({
        $where: function () {
          return this.year !== null && this.year !== undefined && this.year !== "" && this.year !== 0;
        }
      }).exec((err, rows) => !err ? resolve(rows) : reject(err));
    });
  }
}

export {Set};
export default new Set;
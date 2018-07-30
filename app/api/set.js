import api from '~api';
import {setTable} from '~js/db';

class set extends api {
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

  sanitize(item) {
    item.year                  = +item.year;
    item.repair.year           = +item.repair.year;
    item.est.res.kr            = +item.est.res.kr;
    item.est.res.cancel        = +item.est.res.cancel;
    item.est.life.kr           = +item.est.life.kr;
    item.est.life.cancel       = +item.est.life.cancel;
    item.elabor.elabor.before  = +item.elabor.elabor.before;
    item.elabor.elabor.after   = +item.elabor.elabor.after;
    item.elabor.elabor.total   = +item.elabor.elabor.total;
    item.elabor.dev.before     = +item.elabor.dev.before;
    item.elabor.dev.after      = +item.elabor.dev.after;
    item.elabor.dev.total      = +item.elabor.dev.total;
    item.stock.year.kr.num     = +item.stock.year.kr.num;
    item.stock.year.kr.per     = +item.stock.year.kr.per;
    item.stock.year.cancel.num = +item.stock.year.cancel.num;
    item.stock.year.cancel.per = +item.stock.year.cancel.per;
    item.stock.hour.kr.num     = +item.stock.hour.kr.num;
    item.stock.hour.kr.per     = +item.stock.hour.kr.per;
    item.stock.hour.cancel.num = +item.stock.hour.cancel.num;
    item.stock.hour.cancel.per = +item.stock.hour.cancel.per;

    return item;
  }
}

export {set};
export default new set;
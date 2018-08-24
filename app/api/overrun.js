import api from '~api';
import db from '~js/db';
let {overrunTable} = db;

class overrun extends api {
  constructor() {
    super();
    this.table = overrunTable;
  }

  getItems() {
    return this.all();
  }
}

export {overrun};
export default new overrun;
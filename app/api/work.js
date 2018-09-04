import Api from '~api';
import db from '~js/db';
let {workTable} = db;

class Work extends Api{
    constructor() {
        super();
        this.table = workTable;
    }
    getItems() {
        return this.all();
    }
    getPrint() {
        return new Promise((resolve, reject) => {
            this.table.find({
                $where: function () {
                    return !this.departure || this.departure==="";
                }
            }).exec((err, rows) => !err ? resolve(rows) : reject(err));
        });
    }
}

export {Work};
export default new Work;
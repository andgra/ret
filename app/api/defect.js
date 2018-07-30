import api from '~api';
import {defectTable} from '~js/db';

class defect extends api{
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
                    return this.recovery!==null && this.recovery!==undefined && this.recovery!=="";
                }
            }).exec((err, rows) => !err ? resolve(rows) : reject(err));
        });
    }
    getPrint() {
        return new Promise((resolve, reject) => {
            this.table.find({
                $where: function () {
                    return !this.recovery || this.recovery==="";
                }
            }).exec((err, rows) => !err ? resolve(rows) : reject(err));
        });
    }
}

export {defect};
export default new defect;
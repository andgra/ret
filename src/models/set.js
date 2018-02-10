import { model, setTable } from 'core/model';

class set extends model{
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
}

export {set};
export default new set;
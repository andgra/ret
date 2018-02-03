import { crudGenerator, setTable } from '../db.js';

export default Object.assign(crudGenerator(setTable), {
    getItems(filter) {
        return new Promise((resolve, reject) => {
            setTable.find({
                $where: function () {
                    if (!filter || !filter.startDate)
                        return true;
                    return moment(this.createdAt) > moment(filter.startDate, "DD.MM.YYYY");
                }
            }).sort({createdAt: 1}).exec((err, rows) => !err ? resolve(rows) : reject(err));
        });
    }
});
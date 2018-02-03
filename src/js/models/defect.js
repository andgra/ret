import { crudGenerator, defectTable } from '../db.js';

export default Object.assign(crudGenerator(defectTable), {
    getItems() {
        return this.all();
    }
});
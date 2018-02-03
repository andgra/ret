import { crudGenerator, workTable } from '../db.js';

export default Object.assign(crudGenerator(workTable), {
    getItems() {
        return this.all();
    }
});
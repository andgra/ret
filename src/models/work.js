import { model, workTable } from 'core/model';

class work extends model{
    constructor() {
        super();
        this.table = workTable;
    }
    getItems() {
        return this.all();
    }
}

export {work};
export default new work;
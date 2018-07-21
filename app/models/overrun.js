import { model, overrunTable } from '~js/model';

class overrun extends model {
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
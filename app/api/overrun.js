import api from '~api';
import {overrunTable} from '~js/db';

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
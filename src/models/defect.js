import { model, defectTable } from 'core/model';

class defect extends model{
    constructor() {
        super();
        this.table = defectTable;
    }
    getItems() {
        return this.all();
    }
}

export {defect};
export default new defect;
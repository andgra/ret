import overrun from '~api/overrun';
import Migration from '~js/modules/migration';
import {sanitize} from '~js/helpers';
import Structure from '~js/modules/structure';

let migration = new Migration({
  async up() {
    let structure = new Structure(overrun.struct);
    let items = await overrun.all();
    let todo = [];
    for (let item of items) {
      item.consumParts = {p1: item.consum, p2: 0, p3: 0, p4: 0};
      todo.push(overrun.update(sanitize(item, structure.dots)));
    }
    await Promise.all(todo);
  },
});

export default migration;

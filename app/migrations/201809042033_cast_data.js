import defect from '~api/defect';
import set from '~api/set';
import work from '~api/work';
import dictionary from '~api/dictionary';
import Migration from '~js/modules/migration';
import {sanitize} from '~js/helpers';
import Structure from '~js/modules/structure';

async function sanitizeDefects() {
  let structure = new Structure(defect.struct);

  let items = await defect.all();
  let todo = [];
  for (let item of items) {
    todo.push(defect.update(sanitize(item, structure.dots)));
  }
  await Promise.all(todo);
}

async function sanitizeWorks() {
  let structure = new Structure(work.struct);

  let items = await work.all();
  let todo = [];
  for (let item of items) {
    todo.push(work.update(sanitize(item, structure.dots)));
  }
  await Promise.all(todo);
}

async function sanitizeSets() {
  let structure = new Structure(set.struct);

  let items = await set.all();
  let todo = [];
  for (let item of items) {
    todo.push(set.update(sanitize(item, structure.dots)));
  }
  await Promise.all(todo);
}

let migration = new Migration({
  async up() {
    await Promise.all([
      sanitizeDefects(),
      sanitizeWorks(),
      sanitizeSets(),
    ]);
  },
});

export default migration;

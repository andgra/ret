import faker from '~js/modules/faker';
import defect from '~api/defect';
import dictionary from '~api/dictionary';

export default async ({dryRun = false} = {}) => {
  let cnt         = 257;
  let dictsToLoad = ['obj', 'ret', 'type'];

  let dict = {};
  dictsToLoad.forEach(name => dict[name] = dictionary.getDict(name));
  dict = await Promise.allObject(dict);
  for (let name in dict) {
    dict[name] = dict[name].map(item => item.value);
  }

  let items = [];
  for (let i = 0; i < cnt; i++) {
    let failure  = faker.date.past(2);
    let recovery = faker.random.number({min: 0, max: 100}) < 85 ? faker.date.future(1, failure) : null;
    items.push({
      backgroundColor: faker.random.arrayElement(['#ffffff', '#dffd95', '#b0cff1', '#f5c282', '#a0f19e']),
      obj: faker.random.arrayElement(dict.obj),
      place: faker.address.city(),
      ret: faker.random.arrayElement(dict.ret),
      type: faker.random.arrayElement(dict.type),
      zav: faker.random.number({min: 300, max: 5000}),
      failure,
      recovery,
      faulty: faker.lorem.sentence(),
      measures: faker.lorem.sentence(),
      zip: faker.random.number({min: 60, max: 50000}),
    });
  }

  if (!dryRun) {
    await defect.delete({}, true);
    items = items.map(item => defect.insert(item));

    let results = await Promise.all(items);
    console.log(results);
  } else {
    console.log(items);
  }
}
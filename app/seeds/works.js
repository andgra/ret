import faker from '~js/modules/faker';
import work from '~api/work';
import dictionary from '~api/dictionary';

export default async ({dryRun = false} = {}) => {
  let cnt         = 214;
  let dicts = await dictionary.loadDicts(['obj', 'ret', 'type']);

  let items = [];
  for (let i = 0; i < cnt; i++) {
    let arrival  = faker.date.past(2);
    let departure = faker.random.number({min: 0, max: 100}) < 85 ? faker.date.future(1, arrival) : null;
    items.push({
      backgroundColor: faker.random.arrayElement(['#ffffff', '#dffd95', '#b0cff1', '#f5c282', '#a0f19e']),
      obj: faker.random.arrayElement(dicts.obj),
      place: faker.address.city(),
      // ret: faker.random.arrayElement(dicts.ret),
      type: faker.random.arrayElement(dicts.type),
      zav: faker.random.number({min: 300, max: 5000}),
      arrival,
      departure,
      title: faker.lorem.words(),
      factory: faker.company.companyName(),
      people: faker.random.number({min: 1, max: 20}),
      senior: faker.fake("{{name.findName}}, {{phone.phoneNumber(+7-9##-###-##-##)}}"),
      envoy: faker.fake("{{name.findName}}"),
    });
  }

  if (!dryRun) {
    await work.delete({}, true);
    items = items.map(item => work.insert(item));

    let results = await Promise.all(items);
    console.log(results);
  } else {
    console.log(items);
  }
}
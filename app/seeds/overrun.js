import faker from '~js/modules/faker';
import overrun from '~api/overrun';

export default async ({dryRun = false} = {}) => {
  let items = await overrun.generateData();

  for (let item of items) {
    item.yearRes = faker.random.number({min: 1000, max: 100000});
    item.consum = faker.random.number({min: 1000, max: 100000});
  }

  if (!dryRun) {
    items = items.map(item => overrun.updateOrCreate({_id: item._id}, item));

    let results = await Promise.all(items);

    items = await overrun.generateData();

    console.log(results);
  } else {
    console.log(items);
  }
}
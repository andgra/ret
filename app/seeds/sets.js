import faker from '~js/modules/faker';
import set from '~api/set';
import dictionary from '~api/dictionary';
import Structure from "~js/modules/structure";

export default async ({dryRun = false} = {}) => {
  let cnt         = 116;
  let dicts = await dictionary.loadDicts(['obj', 'ret', 'repair', 'condition']);
  let typesDict = await dictionary.getDict('type');

  let structure = new Structure(set.struct);

  let items = [];
  for (let i = 0; i < cnt; i++) {
    let reqFull = faker.random.arrayElement(typesDict);
    let req = reqFull.value;
    let real = faker.random.number({min: 0, max: 100}) < 75 ? req : faker.random.arrayElement(typesDict).value;

    let repairType = faker.random.arrayElement(dicts.repair);
    let repairYear = faker.random.number({min: 1990, max: 2018});

    let estUnique = faker.random.number({min: 0, max: 100}) < 10;
    let est;
    if (!estUnique) {
      // типовой вид РЭТ
      est = reqFull.est;
    } else {
      let resKr = faker.random.number({min: 40, max: 160}) * 100;
      let resCancel = faker.random.number({min: resKr*2 / 100, max: 300}) * 100;
      let lifeKr = Math.round(resKr / 1000);
      let lifeCancel = Math.round(resCancel / 800);
      est = {
        res: {
          kr: resKr,
          cancel: resCancel,
        },
        life: {
          kr: lifeKr,
          cancel: lifeCancel,
        },
      };
    }

    let elaborTotal = faker.random.number({min: 1, max: 160}) * 100;
    let elaborBefore = faker.random.number({min: 1, max: elaborTotal / 100}) * 100;
    let elaborAfter = faker.random.number({min: elaborBefore / 100, max: elaborTotal * 1.2 / 100}) * 100;
    let elabor = {
      total: elaborTotal,
      before: elaborBefore,
      after: elaborAfter,
    };

    let item = {
      backgroundColor: faker.random.arrayElement(['#ffffff', '#dffd95', '#b0cff1', '#f5c282', '#a0f19e']),
      obj: faker.random.arrayElement(dicts.obj),
      place: faker.address.city(),
      ret: faker.random.arrayElement(dicts.ret),
      pn: faker.random.arrayElement(['Да', 'Нет']),
      type: {
        req,
        real,
      },
      serial: faker.random.number({min: 100000, max: 999999}),
      year: faker.random.number({min: 1970, max: 2018}),
      repair: {
        type: repairType,
        year: repairYear
      },
      condition: faker.random.arrayElement(dicts.condition),
      resp: {
        rank: faker.random.arrayElement(['м-р', 'мл. лейт.', 'кап.', 'п-п', 'ст. лет.', 'лет.']),
        fio: faker.name.findName(undefined, undefined, 1),
        order: faker.random.number({min: 1000, max: 99999}),
      },
      est,
      elabor: {
        elabor,
        dev: {},
      },
      stock: {
        year: {
          kr: {},
          cancel: {},
        },
        hour: {
          kr: {},
          cancel: {},
        },
      },
    };

    item.elabor.dev.total = structure.dots['elabor.dev.total'].cb(null, item);
    item.elabor.dev.before = structure.dots['elabor.dev.before'].cb(null, item);
    item.elabor.dev.after = structure.dots['elabor.dev.after'].cb(null, item);

    item.stock.year.kr.num = structure.dots['stock.year.kr.num'].cb(null, item);
    item.stock.year.kr.per = structure.dots['stock.year.kr.per'].cb(null, item);

    item.stock.year.cancel.num = structure.dots['stock.year.cancel.num'].cb(null, item);
    item.stock.year.cancel.per = structure.dots['stock.year.cancel.per'].cb(null, item);

    item.stock.hour.kr.num = structure.dots['stock.hour.kr.num'].cb(null, item);
    item.stock.hour.kr.per = structure.dots['stock.hour.kr.per'].cb(null, item);

    item.stock.hour.cancel.num = structure.dots['stock.hour.cancel.num'].cb(null, item);
    item.stock.hour.cancel.per = structure.dots['stock.hour.cancel.per'].cb(null, item);


    items.push(item);
  }

  if (!dryRun) {
    await set.delete({}, true);
    items = items.map(item => set.insert(item));

    let results = await Promise.all(items);
    console.log(results);
  } else {
    console.log(items);
  }
}
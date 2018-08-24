const Datastore = require('nedb');

let tables = [
  {name: 'db', file: 'db', cached: undefined},
  {name: 'setTable', file: 'sets', cached: undefined},
  {name: 'workTable', file: 'works', cached: undefined},
  {name: 'defectTable', file: 'defects', cached: undefined},
  {name: 'overrunTable', file: 'overrun', cached: undefined},
  {name: 'settingsTable', file: 'settings', cached: undefined},
  {name: 'dictionaryTable', file: 'dictionaries', cached: undefined},
];

let loadTable = name => (new Datastore({
  filename: window.__dirname + '/database/' + name + '.json',
  timestampData: true,
  autoload: true
}));

let output = {};
for (let t of tables) {
  Object.defineProperty(output, t.name, {
    get: function () {
      console.log(t.name);
      if (t.cached === undefined) {
        t.cached = loadTable(t.file);
      }
      return t.cached;
    }
  });
}

export default output;
const Datastore = require('nedb');

let tables = ['db', 'sets', 'works']

let loadTable = name => (new Datastore({
  filename: window.__dirname + '/database/' + name + '.json',
  timestampData: true,
  autoload: true
}));

const db              = loadTable('db');
const setTable        = loadTable('sets');
const workTable       = loadTable('works');
const defectTable     = loadTable('defects');
const overrunTable    = loadTable('overrun');
const settingsTable   = loadTable('settings');
const dictionaryTable = loadTable('dictionaries');
export {db, setTable, workTable, defectTable, overrunTable, settingsTable, dictionaryTable};
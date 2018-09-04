import path from 'path';
import fs from '~js/modules/fs';
import {ngui} from '~js/modules/nw';

/**
 * Получение списка миграций, основанных на названии файлов в папке миграций.
 * Список отсортирован по дате
 *
 * @returns {Array}
 */
function getMigrations() {
  let normalizedPath = path.join(ngui.__dirname, "/app/migrations");
  let migrations = [];

  fs.readdirSync(normalizedPath).forEach(function(file) {
    let migration = require('~migrations/' + file).default;
    if (!migration.id) {
      migration.id = file.substr(0, file.indexOf('.'));
    }
    migrations.push(migration);
  });

  migrations.sort((m1, m2) => ( m1.date < m2.date ? -1 : m1.date > m2.date ? 1 : 0 ));

  return migrations;
}

/**
 * Выполнение всех новых миграций
 * @returns {Promise<*|number>}
 */
async function migrate() {
  let currentVersion = this.settings.lastMigration || 0;

  let migrations = getMigrations();
  let lastMigration = currentVersion;
  for (let mig of migrations) {
    let migDate = mig.date;
    if (migDate > currentVersion) {
      await mig.up();
      lastMigration = migDate;
      console.log('migrated', mig);
    }
  }

  await this.saveSettings({lastMigration});

  return lastMigration;
}

class Migration {
  constructor(params) {
    this.id = params.id;
    this._up = params.up ? params.up : () => new Promise((resolve, reject) => resolve());
    this._down = params.down ? params.down : () => new Promise((resolve, reject) => resolve());
  }
  async up() {
    return await this._up();
  }
  async down() {
    return await this._down();
  }
  set date(value) {}
  get date() {
    return +this.id.substr(0, this.id.indexOf('_'));
  }
}

export {Migration, migrate};
export default Migration;
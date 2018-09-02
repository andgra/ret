// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import Structure from '~js/modules/structure'
import filter from '~store/modules/table/filter'
import edit from '~store/modules/table/edit'
import remove from '~store/modules/table/remove'
import path from 'path'
// import structure from '~store/modules/table/structure'

let defaultQuery = {
  sort: {createdAt: 1},
  where: {},
  limit: 10,
  page: 1
};

export default {
  namespaced: true,
  modules: {
    filter,
    edit,
    remove,
    // structure,
  },
  state: {
    query: clone(defaultQuery),
    defaultQuery,
    rows: [],
    count: 0,
    all: [],
    info: {},
    loading: 2,
    api: null,
    structure: new Structure([], false),
    options: {},
    checks: [],
  },
  getters: {
    checked: state => id => state.checks.indexOf(id) !== -1,
    checkedAll(state) {
      return state.checks.length === state.rows.length;
    },
    dots(state) {
      return state.structure.dots;
    },
    lastOfGrid: (state, getters) => getters.grid.last(),
    grid: state => state.structure.grid,
    struct: state => state.structure.struct,
    maxPage(state) {
      return state.query.limit ? Math.ceil(state.count / state.query.limit) || 1 : 1;
    },
    maxPageByCount: state => count => {
      return state.query.limit ? Math.ceil(count / state.query.limit) || 1 : 1;
    },
    getById: state => id => id ? state.rows.find(row => row._id === id) : undefined,
    page: state => state.query.page,
    limit: state => state.query.limit,
    num: (state, getters) => index => (getters.page - 1) * getters.limit + index + 1,
    controlRemove(state) {
      return state.options.remove === undefined || state.options.remove ? 1 : 0;
    },
    controlDates(state) {
      return state.options.dates === undefined || state.options.dates ? 1 : 0;
    },
    controlAdd(state) {
      return state.options.add === undefined || state.options.add ? 1 : 0;
    },
    controlEdit(state) {
      return state.options.edit === undefined || state.options.edit ? 1 : 0;
    },
    heading(state, getters) {
      return getters.controlEdit + getters.controlRemove * 2 + 1;
    },
    trailing(state, getters) {
      return getters.controlDates * 2 + getters.controlEdit + getters.controlRemove;
    },
    controls(state, getters) {
      return {
        add: getters.controlAdd,
        edit: getters.controlEdit,
        remove: getters.controlRemove,
        dates: getters.controlDates,
        checks: getters.controlRemove,
      }
    },
    entireColspan(state, getters) {
      let entireColspan = 0;
      for (let row of getters.grid) {
        for (let cell of row) {
          entireColspan += cell.colspan;
        }
      }
      return entireColspan;
    },
    entireFullColspan(state, getters) {
      let entireFullColspan = 0;
      for (let row of getters.grid) {
        for (let cell of row) {
          entireFullColspan += cell.fullColspan;
        }
      }
      return entireFullColspan;
    },
    apiName(state) {
      return state.api ? path.basename(state.api.table.filename, '.json') : null;
    },
    apiCols(state, getters) {
      let dots = getters.dots;
      let apiCols = [];
      for (let id in dots) {
        if (dots.hasOwnProperty(id)) {
          let {fullId, hidden} = dots[id];
          apiCols.push({fullId, hidden});
        }
      }
      return apiCols;
    }
  },
  mutations: {
    ['SET_OPTIONS'](state, options) {
      state.options = options;
    },
    /**
     *
     * @param {ActionContext} [state]
     * @param {api} api
     * @constructor
     */
    ['SET_API'](state, api) {
      state.api = api;
    },
    ['SET_STRUCTURE'](state, structure) {
      state.structure = structure;
    },
    ['RELOAD_DATA'](state) {
      state.loading = 1;
    },
    ['LOAD_DATA'](state) {
      state.loading = 2;
    },
    ['DATA_READY'](state) {
      state.loading = 0;
    },
    ['SET_ROWS'](state, rows) {
      state.rows = rows;
    },
    ['SET_COUNT'](state, count) {
      state.count = count;
    },
    ['SET_INFO'](state, info) {
      state.info = info;
    },
    ['SET_ALL'](state, all) {
      state.all = all;
    },
    ['UPDATE_QUERY'](state, query) {
      state.query = query;
    },
    ['SET_PAGE'](state, page) {
      state.query  = {...state.query, page};
      state.checks = [];
    },
    ['UPDATE_DEFAULT_QUERY'](state, defaultQuery) {
      state.defaultQuery = clone(defaultQuery);
    },
    ['SET_CHECKS'](state, checks) {
      state.checks = checks;
    },
  },
  actions: {
    async toggleCheck({commit, state}, id) {
      let checks = state.checks;
      let pos    = checks.indexOf(id);
      if (pos === -1) {
        checks.push(id);
      } else {
        checks.splice(pos, 1);
      }
      commit('SET_CHECKS', checks);
    },
    async toggleCheckAll({commit, state, getters}) {
      // Кликнули по общему чб
      // Запоминаем сколько сейчас отмечено
      let checkedAll = getters.checkedAll;
      // Всегда снимаем сначала все
      let checks     = [];
      if (!checkedAll) {
        // Если не все были отмечены, отмечаем все
        for (let row of state.rows) {
          checks.push(row._id);
        }
      }
      commit('SET_CHECKS', checks);
    },
    async reloadRows({commit, state, dispatch}, query) {
      commit('UPDATE_QUERY', {...state.query, ...query});
      commit('RELOAD_DATA');
      await dispatch('loadRows');
      commit('DATA_READY');
    },
    async loadRows({state, commit}) {
      commit('SET_ROWS', await state.api.all(state.query));
      commit('SET_COUNT', await state.api.count(state.query.where));
    },
    async loadAll({state, commit}) {
      commit('SET_ALL', await state.api.all({...state.defaultQuery, limit: 0}));
    },
    async loadData({commit, state, dispatch, getters}, {options, api, query, infoLoader, dataFetched, struct}) {
      commit('SET_API', api);

      if (options) {
        commit('SET_OPTIONS', options);
      }
      commit('UPDATE_DEFAULT_QUERY', {...state.defaultQuery, ...query});
      commit('UPDATE_QUERY', state.defaultQuery);
      commit('LOAD_DATA');

      let infoPromise = infoLoader(state);

      let all  = await state.api.all({...state.defaultQuery, limit: 0});
      let data = await Promise.allObject({
        rows: state.api.all(state.query),
        count: state.api.count(state.query.where),
        info: infoPromise,
      });

      if (getters.controls.dates) {
        let datesGrid = [
          {
            id: 'createdAt',
            title: 'Создан',
            type: 'datetime',
            sortType: 'date',
            style: {whiteSpace: 'nowrap'},
            edit: false,
          },
          {
            id: 'updatedAt',
            title: 'Изменен',
            type: 'datetime',
            sortType: 'date',
            style: {whiteSpace: 'nowrap'},
            edit: false,
          },
        ];

        struct = [...struct, ...datesGrid];
      }

      let structure = new Structure(struct);


      await dataFetched({all, data, state, commit, structure});

      commit('SET_STRUCTURE', structure);
      commit('SET_ALL', all);
      commit('SET_ROWS', data.rows);
      commit('SET_COUNT', data.count);
      commit('SET_INFO', data.info);

      await dispatch('repairGrid');

      commit('DATA_READY');
    },
    async repairGrid({state, dispatch, commit, getters, rootState}) {
      let grid = state.structure.grid;
      // достаем из базы сохраненные скрытые столбцы
      let apiGrid, dbGrid, dbCols;
      let settings = rootState.settings.options;
      if ((dbGrid = settings.grid) && dbGrid[getters.apiName]) {
        // проверяем на валидность
        if ((dbCols = settings.cols) && dbCols[getters.apiName]
          && JSON.stringify(dbCols[getters.apiName]) !== JSON.stringify(getters.apiCols)
        ) {
          // grid не валиден
          delete(dbGrid[getters.apiName]);
          await dispatch('settings/saveSettings', {grid: dbGrid}, {root: true});

        } else {
          // grid валиден
          apiGrid = dbGrid[getters.apiName];
        }
      }
      for (let i in grid) {
        let beforeColspan = 0;
        for (let cell of grid[i]) {
          cell.orig          = cell.colspan;
          cell.beforeColspan = beforeColspan;
          beforeColspan += cell.orig;
        }
        if (+i + 1 < grid.length) {
          if (grid[i][0].title === "") {
            grid[i][0].colspan += getters.heading;
          } else {
            grid[i].unshift({title: "", colspan: getters.heading})
          }

          if (grid[i].last().title === "") {
            grid[i].last().colspan += getters.trailing;
          } else {
            grid[i].push({title: "", colspan: getters.trailing})
          }
        }
        for (let cell of grid[i]) {
          cell.fullColspan = cell.colspan;
        }
        // применяем запомненные colspan
        if (apiGrid) {
          let dbRow = apiGrid[i];
          for (let j in dbRow) {
            grid[i][j].colspan = dbRow[j];
          }
        }
      }


      commit('SET_STRUCTURE', {...state.structure, grid});
    },
    async setPage({state, dispatch, commit}, page) {
      commit('SET_PAGE', page);
      await dispatch('reloadRows');
    },
    async setSort({state, dispatch, commit}, {sortBy, sortDirection}) {
      let sort = {[sortBy]: sortDirection};
      let page = state.defaultQuery.page;
      commit('SET_PAGE', page);
      await dispatch('reloadRows', {...state.query, ...{sort}});
    },
    async setLimit({state, dispatch, commit}, limit) {
      let page = state.defaultQuery.page;
      commit('SET_PAGE', page);
      await dispatch('reloadRows', {...state.query, ...{limit}});
    },
    async setWhere({state, dispatch, commit}, filters) {
      let page = state.defaultQuery.page;
      commit('SET_PAGE', page);
      let where = {};
      for (let field in filters) {
        if (filters.hasOwnProperty(field) && filters[field].length) {
          where[field] = {$in: filters[field]};
        }
      }
      await dispatch('reloadRows', {...state.query, ...{where}});
    },
    async toggleCol({state, dispatch, commit, rootState, getters}, {id, checked}) {
      let change = checked ? 1 : -1;
      let grid   = clone(state.structure.grid);

      let {rowNum, cell} = findInGrid(grid, id);
      let foundCell      = cell;

      if (foundCell) {
        // ширина ячеек до нужной
        let before = foundCell.beforeColspan;
        // ширина ячеек до и вместе с нужной
        let after  = before + foundCell.fullColspan;

        foundCell.colspan = checked ? foundCell.fullColspan : 0;

        // родители -> строка раньше найденной
        for (let j = 0; j < rowNum; j++) {
          let row = grid[j];
          // идем с конца и ищем первую ячейку с отступом слева как у найденной или меньше
          for (let i = row.length - 1; i >= 0; i--) {
            let cell = row[i];
            if (cell.beforeColspan <= before) {
              // найден нужный родитель
              cell.colspan += foundCell.fullColspan * change;
              break;
            }
          }
        }
        // потомки -> строка позже найденной
        for (let j = rowNum + 1; j < grid.length; j++) {
          let row = grid[j];
          // идем с начала и при нахождении всех отступов в границах найденной помечаем как нужные
          for (let i = row.length - 1; i >= 0; i--) {
            let cell = row[i];
            if (cell.beforeColspan >= before && cell.beforeColspan < after) {
              // найден нужный потомок
              cell.colspan = checked ? cell.fullColspan : 0;
            }
          }
        }
      }
      commit('SET_STRUCTURE', {...state.structure, grid});
    },
    async toggleAllCols({state, dispatch, commit, rootState, getters}, checked) {
      let grid = clone(state.structure.grid);
      for (let row of grid) {
        for (let cell of row) {
          cell.colspan = checked ? cell.fullColspan : 0;
        }
      }
      commit('SET_STRUCTURE', {...state.structure, grid});
    },
    async rememberColspan({state, dispatch, commit, rootState, getters}) {
      // сохраняем grid с colspan (state)
      let grid = rootState.settings.options.grid ? rootState.settings.options.grid : {};

      grid[getters.apiName] = getters.grid.map(row => row.map(({colspan}) => (colspan)));

      // также сохраняем dots для определения валидности grid'а
      let cols = rootState.settings.options.cols ? rootState.settings.options.cols : {};



      cols[getters.apiName] = getters.apiCols;

      await dispatch('settings/saveSettings', {grid, cols}, {root: true});
      await dispatch('notify', 'Сохранено', {root: true});
    },
  }
};
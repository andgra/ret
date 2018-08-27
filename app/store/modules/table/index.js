// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import Structure from '~js/modules/structure'
import filter from '~store/modules/table/filter'
import edit from '~store/modules/table/edit'
import remove from '~store/modules/table/remove'

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
    structure: null,
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
    colspanFooter: function (state, getters) {
      return (getters.controlEdit * 2) + (getters.controlRemove * 3) + getColspan(getters.lastOfGrid) + (getters.controlDates * 2) + 1;
    },
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
    async loadData({commit, state, dispatch}, {options, api, query, infoLoader, dataFetched, struct, repairGrid}) {
      if (api) {
        commit('SET_API', api);
      }
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

      let structure = new Structure(struct);

      await dataFetched({all, data, state, commit, structure});

      commit('SET_STRUCTURE', structure);
      commit('SET_ALL', all);
      commit('SET_ROWS', data.rows);
      commit('SET_COUNT', data.count);
      commit('SET_INFO', data.info);

      if (repairGrid) {
        await dispatch('repairGrid');
      }

      commit('DATA_READY');
    },
    async repairGrid({state, dispatch, commit, getters}) {
      let grid = state.structure.grid;
      for (let i in grid) {
        if (+i + 1 < grid.length) {
          for (let cell of grid[i]) {
            cell.orig = cell.colspan;
          }
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
        } else {
          for (let j in grid[i]) {
            grid[i][j].num = +JSON.parse(JSON.stringify(j));
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
    // async sanitize({state, dispatch}, item) {
    //   return item;
    // },
  }
};
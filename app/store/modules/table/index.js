// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import path from 'path'
import filter from '~store/modules/table/filter'
import edit from '~store/modules/table/edit'
import remove from '~store/modules/table/remove'
import structure from '~store/modules/table/structure'
import {clone} from '~js/helpers';

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
    structure,
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
    options: {},
    checks: [],
  },
  getters: {
    checked: state => id => state.checks.indexOf(id) !== -1,
    checkedAll(state) {
      return state.checks.length === state.rows.length;
    },
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
    controls(state, getters) {
      return {
        add: getters.controlAdd,
        edit: getters.controlEdit,
        remove: getters.controlRemove,
        dates: getters.controlDates,
        checks: getters.controlRemove,
      }
    },
    apiName(state) {
      return state.api ? path.basename(state.api.table.filename, '.json') : null;
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


      await dataFetched({all, data, state, commit});

      await dispatch('table/structure/initStructure', struct, {root: true});

      commit('SET_ALL', all);
      commit('SET_ROWS', data.rows);
      commit('SET_COUNT', data.count);
      commit('SET_INFO', data.info);

      commit('DATA_READY');
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
  }
};
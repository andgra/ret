// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import Structure from '~js/modules/structure'

let defaultQuery = {
  sort: {createdAt: 1},
  where: {},
  limit: 10,
  page: 1
};

export default {
  state: {
    count: 0,
    query: clone(defaultQuery),
    defaultQuery,
    rows: [],
    info: {},
    loading: 0,
    model: null,
  },
  modules: {
  },
  mutations: {
    ['SET_MODEL'](state, model) {
      state.model = model;
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
    ['SET_INFO'](state, info) {
      state.info = info;
    },
    ['UPDATE_QUERY'](state, query) {
      state.query = query;
    },
    ['UPDATE_DEFAULT_QUERY'](state, defaultQuery) {
      state.defaultQuery = clone(defaultQuery);
    },
  },
  getters: {
    sortBy(state) {
      return Object.keys(state.query.sort)[0];
    },
    sortDirection(state) {
      return Object.values(state.query.sort)[0];
    },
  },
  actions: {
    async reloadRows({commit, state}, query) {
      commit('UPDATE_QUERY', query);
      commit('RELOAD_DATA');
      commit('SET_ROWS', await state.model.all(state.query));
      commit('DATA_READY');
    },
    async loadData({commit, state}, {query, infoLoader, dataFetched, struct}) {
      commit('UPDATE_DEFAULT_QUERY', query);
      commit('UPDATE_QUERY', query);
      commit('LOAD_DATA');
      let data = await Promise.allObject({
        rows: await state.model.all(state.query),
        info: await infoLoader(state),
      });

      let structure = new Structure(struct);
      structure.start();

      dataFetched({data, state, structure});
      commit('SET_ROWS', data.rows);
      commit('SET_INFO', data.info);
      commit('DATA_READY');
    },
    async setPage({state, dispatch}, page) {
      dispatch('reloadRows', {...state.query, page});
    },
    async setSort({state, dispatch}, {sortBy, sortDirection}) {
      let sort = {[sortBy]: sortDirection};
      let page = state.defaultQuery.page;
      let where = state.defaultQuery.where;
      dispatch('reloadRows', {...state.query, ...{sort, page, where}});
    },
    async setLimit({state, dispatch}, limit) {
      let page = state.defaultQuery.page;
      dispatch('reloadRows', {...state.query, ...{limit, page}});
    },
  }
};
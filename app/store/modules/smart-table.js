// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import Structure from '~js/modules/structure'
export default {
  state: {
    count: 0,
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
    }
  },
  actions: {
    async reloadRows({commit, state}, options) {
      commit('RELOAD_DATA');
      commit('SET_ROWS', await state.model.all(options));
      commit('DATA_READY');
    },
    async loadData({commit, state}, {rowsOptions, infoLoader, dataFetched, struct}) {
      commit('LOAD_DATA');
      let data = await Promise.allObject({
        rows: await state.model.all(options),
        info: await infoLoader(state),
      });

      let structure = new Structure(struct);
      structure.start();

      dataFetched({data, state, structure});
      commit('SET_ROWS', data.rows);
      commit('SET_INFO', data.info);
      commit('DATA_READY');
    }
  }
};
// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

export default {
  namespaced: true,
  state: {
    toRemove: [],
    removeModal: false,
  },
  getters: {
    tablePage: (state, getters, rootState, rootGetters) => rootGetters['table/page'],
    maxTablePageByCount: (state, getters, rootState, rootGetters) => rootGetters['table/maxPageByCount'],
  },
  mutations: {
    ['SET_REMOVE'](state, arr) {
      state.toRemove = arr;
    },
    ['OPEN_REMOVE_MODAL'](state) {
      state.removeModal = true;
    },
    ['CLOSE_REMOVE_MODAL'](state) {
      state.removeModal = false;
    },
  },
  actions: {
    async removeRows({state, dispatch, commit, rootState, getters}) {
      commit('table/RELOAD_DATA', null, {root: true});
      commit('CLOSE_REMOVE_MODAL');

      // Получаем функцию удаления - стандартную или кастомную
      let removeFunc = rootState.table.options.removeRow ?
        rootState.table.options.removeRow :
        rootState.table.api.delete.bind(rootState.table.api);

      let $or = [];
      state.toRemove.forEach(_id => $or.push({_id}));

      // Дожидаемся удаления всех строк
      let numDeleted = await removeFunc({$or}, true);

      // Если текущая страница не пропадает после удаления строк, то оставляем её, иначе - последняя страница
      let page = Math.min(getters.tablePage, getters.maxTablePageByCount(rootState.table.count - numDeleted));

      // Обновляем данные
      commit('table/SET_PAGE', page, {root: true});
      await Promise.all([
        dispatch('table/loadAll', null, {root: true}),
        dispatch('table/loadRows', null, {root: true}), // Здесь же и идет обновление данных на странице
      ]);

      commit('SET_REMOVE', []);
      commit('table/DATA_READY', null, {root: true});
    },
    async openRemove({state, commit}, toRemove) {
      commit('SET_REMOVE', toRemove);
      commit('OPEN_REMOVE_MODAL');
    },
    async cancelRemove({commit}) {
      commit('SET_REMOVE', []);
      commit('CLOSE_REMOVE_MODAL');
    },
  }
};
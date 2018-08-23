// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

export default {
  namespaced: true,
  state: {
    toRemove: [],
    removeModal: false,
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
    async removeRows({state, dispatch, commit, rootGetters, rootState}) {
      commit('RELOAD_DATA', null, {root: true});
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
      let page = Math.min(rootGetters['table/page'], rootGetters['table/maxPageByCount'](rootState.table.count - numDeleted));

      // Обновляем данные
      commit('SET_PAGE', page, {root: true});
      await Promise.all([
        dispatch('loadAll', null, {root: true}),
        dispatch('loadRows', null, {root: true}), // Здесь же и идет обновление данных на странице
      ]);

      commit('SET_REMOVE', []);
      commit('DATA_READY', null, {root: true});
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
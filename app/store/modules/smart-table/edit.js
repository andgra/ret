// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

export default {
  namespaced: true,
  state: {
    editRow: null,
    editModal: false,
  },
  getters: {
    tableDots: (state, getters, rootState, rootGetters) => rootGetters['table/dots'],
    getRowById: (state, getters, rootState, rootGetters) => rootGetters['table/getById'],
    maxTablePageByCount: (state, getters, rootState, rootGetters) => rootGetters['table/maxPageByCount'],
  },
  mutations: {
    ['UPDATE_EDIT_ROW'](state, row) {
      state.editRow = row;
    },
    ['RESET_EDIT_ROW'](state) {
      state.editRow = null;
    },
    ['OPEN_EDIT_MODAL'](state) {
      state.editModal = true;
    },
    ['CLOSE_EDIT_MODAL'](state) {
      state.editModal = false;
    },
  },
  actions: {
    async saveEdit({state, dispatch, commit, rootState, getters}) {
      commit('RELOAD_DATA', null, {root: true});
      commit('CLOSE_EDIT_MODAL');
      let result;

      // Добавляем или обновляем запись
      let item = state.editRow;
      delete item.index;
      item = rootState.table.api.sanitize(item, getters.tableDots);
      if (rootState.table.options.saveRow) {
        result = await rootState.table.options.saveRow(item);
      } else {
        result = await rootState.table.api.updateOrCreate({_id: item._id}, item);
      }
      let {insert} = result;

      if (insert) {
        // Переход на последнюю страницу
        // Учитываем, что кол-во записей на 1 больше
        let page = getters.maxTablePageByCount(rootState.table.count + 1);
        commit('SET_PAGE', page, {root: true});
      }
      // Обновляем записи параллельно, т.к. общее число записей уже учтено
      await Promise.all([
        dispatch('table/loadAll', null, {root: true}),
        dispatch('table/loadRows', null, {root: true}), // Здесь же идет и обновление страницы
      ]);
      dispatch('notify', 'Сохранено', {root: true});

      commit('RESET_EDIT_ROW');
      commit('DATA_READY', null, {root: true});
    },
    async openEdit({commit, getters, rootState}, id) {
      let row = getters.getRowById(id);
      row = row ? row : rootState.table.structure.defaultRow;
      commit('UPDATE_EDIT_ROW', clone(row));
      commit('OPEN_EDIT_MODAL');
    },
    async cancelEdit({commit}) {
      commit('CLOSE_EDIT_MODAL');
      commit('RESET_EDIT_ROW');
    },
  }
};
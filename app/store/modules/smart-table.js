// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import Structure from '~js/modules/structure'
import moment from 'moment';

let defaultQuery = {
  sort: {createdAt: 1},
  where: {},
  limit: 10,
  page: 1
};

export default {
  namespaced: true,
  state: {
    query: clone(defaultQuery),
    defaultQuery,
    rows: [],
    all: [],
    info: {},
    loading: 2,
    api: null,
    structure: null,
    editRow: null,
    editModal: null,
    options: {},
    toRemove: [],
  },
  modules: {},
  mutations: {
    ['SET_OPTIONS'](state, options) {
      state.options = options;
    },
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
    ['SET_INFO'](state, info) {
      state.info = info;
    },
    ['SET_ALL'](state, all) {
      state.all = all;
    },
    ['UPDATE_QUERY'](state, query) {
      state.query = query;
    },
    ['UPDATE_DEFAULT_QUERY'](state, defaultQuery) {
      state.defaultQuery = clone(defaultQuery);
    },
    ['ADD_ROW'](state) {
      state.editRow = clone(state.structure.defaultRow);
    },
    ['EDIT_ROW'](state, index) {
      state.editRow = clone(state.rows[index]);
    },
    ['UPDATE_EDIT_ROW'](state, row) {
      state.editRow = row;
    },
    ['RESET_EDIT_ROW'](state) {
      state.editRow = null;
    },
    ['OPEN_EDIT_MODAL'](state) {
      state.editModal.open();
    },
    ['CLOSE_EDIT_MODAL'](state) {
      state.editModal.close();
    },
    ['SET_REMOVE'](state, arr) {
      state.toRemove = arr;
    },
    ['SET_EDIT_MODAL'](state, editModal) {
      state.editModal = editModal;
    },
  },
  getters: {
    sortBy(state) {
      return Object.keys(state.query.sort)[0];
    },
    count(state) {
      return state.all.length;
    },
    maxPage(state, getters) {
      return state.query.limit ? Math.ceil(getters.count / state.query.limit) || 1 : 1;
    },
    maxPageByCount: state => count => {
      return state.query.limit ? Math.ceil(count / state.query.limit) || 1 : 1;
    },
    sortDirection(state) {
      return Object.values(state.query.sort)[0];
    },
    editMode(state) {
      return state.editRow !== null;
    },
    page: state => state.query.page,
    limit: state => state.query.limit,
    num: (state, getters) => index => (getters.page - 1) * getters.limit + index + 1,
  },
  actions: {
    async reloadRows({commit, state}, query) {
      commit('UPDATE_QUERY', {...state.query, ...query});
      commit('RELOAD_DATA');
      commit('SET_ROWS', await state.api.all(state.query));
      commit('DATA_READY');
    },
    async loadAll({state, commit}) {
      commit('SET_ALL', await state.api.all({...state.defaultQuery, limit: 0}));
    },
    async loadData({commit, state}, {options, api, query, infoLoader, dataFetched, struct}) {
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
      let all         = await state.api.all({...state.defaultQuery, limit: 0});

      let data = await Promise.allObject({
        rows: state.api.all(state.query),
        info: infoPromise,
      });

      let structure = new Structure(struct);

      await dataFetched({all, data, state, commit, structure});

      commit('SET_STRUCTURE', structure);
      commit('SET_ALL', all);
      commit('SET_ROWS', data.rows);
      commit('SET_INFO', data.info);
      commit('DATA_READY');
    },
    async setPage({state, dispatch}, page) {
      await dispatch('reloadRows', {...state.query, page});
    },
    async setSort({state, dispatch}, {sortBy, sortDirection}) {
      let sort  = {[sortBy]: sortDirection};
      let page  = state.defaultQuery.page;
      let where = state.defaultQuery.where;
      await dispatch('reloadRows', {...state.query, ...{sort, page, where}});
    },
    async setLimit({state, dispatch}, limit) {
      let page = state.defaultQuery.page;
      await dispatch('reloadRows', {...state.query, ...{limit, page}});
    },
    async saveEdit({state, dispatch, commit, getters}) {
      commit('RELOAD_DATA');
      commit('CLOSE_EDIT_MODAL');
      let result;

      // Добавляем или обновляем запись
      let item  = state.editRow;
      let index = item.index;
      delete item.index;
      if (state.options.saveRow) {
        result = await state.options.saveRow(item);
      } else {
        result = await state.api.updateOrCreate({_id: item._id}, item);
      }
      let {insert, doc} = result;

      if (insert) {
        // Переход на последнюю страницу
        // Учитываем, что кол-во записей на 1 больше
        let lastPage = getters.maxPageByCount(getters.count + 1);
        // Обновляем записи параллельно, т.к. общее число записей уже учтено
        await Promise.all([
          dispatch('loadAll'),
          dispatch('setPage', lastPage), // Здесь же идет и обновление страницы
        ]);
      } else {
        // Обновляем записи параллельно, т.к. количество записей не изменилось
        await Promise.all([
          dispatch('loadAll'),
          dispatch('reloadRows'),
        ]);
      }
      dispatch('notify', 'Сохранено', {root: true});

      commit('RESET_EDIT_ROW');
      commit('DATA_READY');
    },
    async removeRows({state, dispatch, commit}) {
      commit('RELOAD_DATA');

      // Получаем функцию удаления - стандартную или кастомную
      let removeFunc = state.options.removeRow ? state.options.removeRow : state.api.delete;

      let $or = [];
      state.toRemove.forEach(_id => $or.push({_id}));

      // Дожидаемся удаления всех строк
      let numDeleted = await removeFunc({$or}, true);

      // Если текущая страница не пропадает после удаления строк, то оставляем её, иначе - последняя страница
      let page = Math.min(state.query.page, state.maxPageByCount(state.count - numDeleted));

      // Обновляем данные
      await Promise.all([
        dispatch('loadAll'),
        dispatch('setPage', page), // Здесь же и идет обновление данных на странице
      ]);

      commit('SET_REMOVE', []);
      commit('DATA_READY');
    },
    async cancelEdit({commit}) {
      commit('CLOSE_EDIT_MODAL');
      commit('RESET_EDIT_ROW');
    },
    async openEdit({state, commit}, index) {
      if (isNumeric(index) && state.rows[index]) {
        commit('EDIT_ROW', index);
      } else {
        commit('ADD_ROW');
      }
      commit('OPEN_EDIT_MODAL');
    },
  }
};
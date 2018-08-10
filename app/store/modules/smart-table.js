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
    editModal: false,
    options: {},
    toRemove: [],
    checks: [],
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
      state.editModal = true;
    },
    ['CLOSE_EDIT_MODAL'](state) {
      state.editModal = false;
    },
    ['SET_REMOVE'](state, arr) {
      state.toRemove = arr;
    },
    ['TOGGLE_CHECK'](state, id) {
      let pos = state.checks.indexOf(id);
      if (pos === -1) {
        state.checks.push(id);
      } else {
        state.checks.splice(pos, 1);
      }
    },
    ['TOGGLE_CHECK_ALL'](state) {
      // Кликнули по общему чб
      // Запоминаем сколько сейчас отмечено
      let curChecked = state.checks.length;
      // Всегда снимаем сначала все
      state.checks = [];
      if(curChecked !== state.rows.length) {
        // Если не все были отмечены, отмечаем все
        for (let row of state.rows) {
          state.checks.push(row._id);
        }
      }
    },
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
    async setPage({state, dispatch}, page) {
      await dispatch('reloadRows', {...state.query, page});
    },
    async toggleSort({state, dispatch, getters}, sortBy) {
      let sortDirection;
      if (getters.sortBy === sortBy) {
        if (getters.sortDirection === -1) {
          // третий клик подряд
          sortBy = Object.keys(state.defaultQuery.sort)[0];
          sortDirection = Object.values(state.defaultQuery.sort)[0];
        } else {
          // второй клик подряд
          sortDirection = -1;
        }
      } else {
        // первый клик по столбцу
        sortDirection = 1;
      }

      await dispatch('setSort', {sortBy, sortDirection});
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
    // async sanitize({state, dispatch}, item) {
    //   return item;
    // },
    async saveEdit({state, dispatch, commit, getters}) {
      commit('RELOAD_DATA');
      commit('CLOSE_EDIT_MODAL');
      let result;

      // Добавляем или обновляем запись
      let item  = state.editRow;
      delete item.index;
      item = state.api.sanitize(item, getters.dots);
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
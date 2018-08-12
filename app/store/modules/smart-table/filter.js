// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

export default {
  namespaced: true,
  modules: {},
  state: {
    search: '',
    cellId: '',
    position: {left: 0, top: 0},
    popup: false,
    appliedFilters: {},
    checkedOptions: [],
  },
  getters: {
    sortBy(state, getters, rootState) {
      return Object.keys(rootState.table.query.sort)[0];
    },
    sortDirection(state, getters, rootState) {
      return Object.values(rootState.table.query.sort)[0];
    },
    filterOptions: (state, getters, rootState) => {
      let options = new Set();
      let cellId = state.cellId;
      // options.add('--');
      for (let item of rootState.table.all) {
        let value = ('' + getInObj(item, cellId)).trim();
        value = value !== '' ? value : '(Пустые)';
        if (state.search !== '' && value.toLowerCase().indexOf(state.search.toLowerCase()) === -1) {
          continue;
        }
        options.add(value);
      }
      return [...options];
    },
    isAllChecked(state, getters) {
      let maybeOptions = state.checkedOptions;
      let allOptions = getters.filterOptions;
      let checkedOptions = maybeOptions.filter(v => allOptions.indexOf(v) !== -1);
      return checkedOptions.length === allOptions.length;
    },
    isAllIndeterminate(state, getters) {
      return state.checkedOptions.length && !getters.isAllChecked;
    },
    isActionsActive: (state, getters) => cellId => {
      return getters.isSortActive(cellId) || getters.isFilterActive(cellId)
    },
    isSortActive: (state, getters) => cellId => {
      return getters.sortBy === cellId
    },
    isFilterActive: state => cellId => {
      return state.appliedFilters[cellId] && state.appliedFilters[cellId].length;
    },
  },
  mutations: {
    setCurrentFilter(state) {
      let currentFilters = state.appliedFilters;
      if (!state.checkedOptions.length) {
        delete(currentFilters[state.cellId]);
      } else {
        currentFilters = {...currentFilters, [state.cellId]: state.checkedOptions};
      }
      state.appliedFilters = currentFilters;
    },
    setAppliedFilters(state, appliedFilters) {
      state.appliedFilters = appliedFilters;
    },
    setCheckedOptions(state, checks) {
      state.checkedOptions = checks;
    },
    setSearch(state, search) {
      state.search = search;
    },
    setCellId(state, cellId) {
      state.cellId = cellId;
    },
    setPosition(state, position) {
      state.position = position;
    },
    openPopup(state) {
      state.popup = true;
    },
    closePopup(state) {
      state.popup = false; 
    },
  },
  actions: {
    async applyFilter({commit, state, getters, dispatch}) {
      commit('closePopup');
      if (getters.isAllChecked) {
        // отмечены все, т.е. фильтр снимаем
        commit('setCheckedOptions', []);
      }
      commit('setCurrentFilter');
      // обновляем данные с учетом фильтров
      await dispatch('table/setWhere', state.appliedFilters, {root: true});
    },
    async openFilter({state, getters, commit}, {id, position}) {
      commit('setSearch', '');
      commit('setCellId', id);
      let allOptions = getters.filterOptions;
      let checkedOptions = clone(allOptions);
      if (getters.isFilterActive(id)) {
        let maybeOptions = state.appliedFilters[id];
        checkedOptions = maybeOptions.filter(v => allOptions.indexOf(v) !== -1);
      }
      commit('setCheckedOptions', checkedOptions);
      commit('openPopup');
      commit('setPosition', position);
    },
    async closeFilter({commit}) {
      commit('closePopup');
    },
    async toggleSort({state, dispatch, getters, rootState}, sortBy) {
      let sortDirection;
      if (getters.sortBy === sortBy) {
        if (getters.sortDirection === -1) {
          // третий клик подряд
          sortBy        = Object.keys(rootState.table.defaultQuery.sort)[0];
          sortDirection = Object.values(rootState.table.defaultQuery.sort)[0];
        } else {
          // второй клик подряд
          sortDirection = -1;
        }
      } else {
        // первый клик по столбцу
        sortDirection = 1;
      }

      await dispatch('table/setSort', {sortBy, sortDirection}, {root: true});
    },
    async applySort({state, commit, dispatch, getters}, sortDirection) {
      commit('closePopup');
      await dispatch('table/setSort', {sortBy: state.cellId, sortDirection}, {root: true});
    }
  }
};
// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'
import {getInObj, clone} from '~js/helpers';

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
      let options = [];
      let addedKeys = [];
      let cellId = state.cellId;
      // options.add('--');
      for (let item of rootState.table.all) {
        let value = getInObj(item, cellId);
        // запоминаем исходное значение
        let key = clone(value);
        // если такое значение уже было добавлено, то идем дальше
        if (addedKeys.indexOf(key) !== -1) {
          continue;
        }
        // если строка, то обрезаем от пробелов
        value = ('' + value === value) ? ('' + value).trim() : value;
        // если пустая строка, то заменяем на служебное слово
        value = value !== '' ? value : '(Пустые)';
        // if (state.search !== '' && ('' + value).toLowerCase().indexOf(state.search.toLowerCase()) === -1) {
        //   continue;
        // }
        addedKeys.push(key);
        options.push({key, value});
      }
      options.sort((o1, o2) => (o1.value === o2.value ? 0 : o1.value < o2.value ? -1 : 1));
      return options;
    },
    searchedOptions: (state, getters) => {
      if (state.search === '') {
        return getters.filterOptions;
      }
      return getters.filterOptions.filter(option => (('' + option.value).toLowerCase().indexOf(state.search.toLowerCase()) !== -1));
    },
    isFoundSomething(state, getters) {
      return getters.filterOptions.length;
    },
    isAllChecked(state, getters) {
      let maybeOptions = state.checkedOptions;
      let allOptions = getters.searchedOptions.map(o => JSON.stringify(o.key));
      let checkedOptions = maybeOptions.filter(v => allOptions.indexOf(JSON.stringify(v)) !== -1);
      return checkedOptions.length === allOptions.length;
    },
    isCheckedWholeOptions(state, getters) {
      return JSON.stringify(getters.searchedOptions) === JSON.stringify(getters.filterOptions);
    },
    isAllIndeterminate(state, getters) {
      return state.checkedOptions.length && !getters.isAllChecked;
    },
    isActionsActive: (state, getters) => cellId => {
      return getters.isSortActive(cellId) || getters.isFilterActive(cellId)
    },
    isSortActive: (state, getters) => sortBy => {
      return getters.sortBy === sortBy;
    },
    isCurrentDirection: (state, getters) => (sortDirection) => {
      return getters.isSortActive(state.cellId) && getters.sortDirection === sortDirection;
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
        currentFilters[state.cellId] = state.checkedOptions;
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
      if (getters.isCheckedWholeOptions) {
        // отмечены все, т.е. фильтр снимаем
        commit('setCheckedOptions', []);
      }
      let oldFilterOptions = state.appliedFilters[state.cellId];
      commit('setCurrentFilter');
      let newFilterOptions = state.appliedFilters[state.cellId];
      // обновляем данные с учетом фильтров
      oldFilterOptions = oldFilterOptions !== undefined ? clone(oldFilterOptions).sort() : oldFilterOptions;
      newFilterOptions = newFilterOptions !== undefined ? clone(newFilterOptions).sort() : newFilterOptions;
      if (JSON.stringify(oldFilterOptions) !== JSON.stringify(newFilterOptions)) {
        await dispatch('table/setWhere', state.appliedFilters, {root: true});
      }
    },
    async resetFilter({commit, state, getters, dispatch}) {
      commit('closePopup');
      commit('setCheckedOptions', []);
      commit('setCurrentFilter');
      await dispatch('table/setWhere', state.appliedFilters, {root: true});
    },
    async openFilter({state, getters, commit}, {id, position}) {
      commit('setSearch', '');
      commit('setCellId', id);
      // установка выбранных значений
      let allOptions = getters.filterOptions.map(o => o.key);
      // по умолчанию все стоят
      let checkedOptions = clone(allOptions);
      if (getters.isFilterActive(id)) {
        // отсекаем те значения, которые уже выбраны ранее
        let appliedOptions = state.appliedFilters[id];
        // для сравнения сериализуем данные, чтобы процесс шел быстрее
        allOptions = allOptions.map(key => JSON.stringify(key));
        // сравниваем значения из памяти c возможными
        let filteredOptions = appliedOptions.filter(v => allOptions.indexOf(JSON.stringify(v)) !== -1);
        checkedOptions = filteredOptions.length ? filteredOptions : checkedOptions;
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
    async applySort({state, commit, dispatch, getters, rootState}, sortDirection) {
      commit('closePopup');
      let sortBy = state.cellId;
      if (getters.sortBy === sortBy && getters.sortDirection === sortDirection) {
        sortBy        = Object.keys(rootState.table.defaultQuery.sort)[0];
        sortDirection = Object.values(rootState.table.defaultQuery.sort)[0];
      }
      await dispatch('table/setSort', {sortBy, sortDirection}, {root: true});
    }
  }
};
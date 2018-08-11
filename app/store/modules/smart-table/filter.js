// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

export default {
  namespaced: true,
  state: {
    search: '',
    cellId: '',
    position: {left: 0, top: 0},
    popup: false,
    checkedOptions: [],
  },
  modules: {},
  getters: {
    // checked: state => id => state.checks.indexOf(id) !== -1,
    // checkedAll(state) {
    //   return state.checks.length === state.rows.length;
    // },
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
  },
  mutations: {
    // ['SET_CHECKS'](state, checks) {
    //   state.checks = checks;
    // },
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
    // async toggleCheck({commit, state}, id) {
    //   let checks = state.checks;
    //   let pos    = checks.indexOf(id);
    //   if (pos === -1) {
    //     checks.push(id);
    //   } else {
    //     checks.splice(pos, 1);
    //   }
    //   commit('SET_CHECKS', checks);
    // },
    // async toggleCheckAll({commit, state, getters}) {
    //   // Кликнули по общему чб
    //   // Запоминаем сколько сейчас отмечено
    //   let checkedAll = getters.checkedAll;
    //   // Всегда снимаем сначала все
    //   let checks     = [];
    //   if (!checkedAll) {
    //     // Если не все были отмечены, отмечаем все
    //     for (let row of state.rows) {
    //       checks.push(row._id);
    //     }
    //   }
    //   commit('SET_CHECKS', checks);
    // },
    async applyFilter({commit}) {
      commit('closePopup');
    },
    async openFilter({commit}, {id, position}) {
      commit('setSearch', '');
      commit('setCellId', id);
      commit('openPopup');
      commit('setPosition', position);
    },
    async closeFilter({commit}) {
      commit('closePopup');
    },
  }
};
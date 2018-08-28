// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

export default {
  namespaced: true,
  state: {},
  getters: {
    tableGrid: (state, getters, rootState, rootGetters) => rootGetters['table/grid'],
    // structure: (state, getters, rootState, rootGetters) => rootGetters['table/structure'],
    tableLastOfGrid: (state, getters, rootState, rootGetters) => rootGetters['table/lastOfGrid'],
  },
  mutations: {},
  actions: {}
};
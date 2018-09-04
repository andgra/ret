import Vue from '~js/modules/vue'
import Vuex from 'vuex'
import table from '~store/modules/table'
import settings from '~store/modules/settings'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    table,
    settings
  },
  state: {
    snackbarEmitter: null
  },
  mutations: {
    ['SET_SNACKBAR_EMITTER'](state, emitter) {
      state.snackbarEmitter = emitter;
    }
  },
  actions: {
    /**
     * Вызывает сообщение снизу экрана
     *
     * @param state
     * @param [message]
     */
    notify({state}, message) {
      state.snackbarEmitter.$emit('msgSent', {message});
    },
  },
})
import Vue from '~js/modules/vue'
import Vuex from 'vuex'
import table from './modules/smart-table'
import settings from './modules/settings'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    table,
    settings
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
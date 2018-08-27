import settings from '~api/settings';

const store = {
  namespaced: true,
  state: {
    options: null
  },
  mutations: {
    gotSettings(state, settings) {
      state.options = settings
    }
  },
  actions: {
    async fetchSettings({commit}) {
      commit('gotSettings', await settings.all());
    }
  },
};

export default store;
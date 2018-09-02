import settings from '~api/settings';

const store = {
  namespaced: true,
  state: {
    options: null
  },
  mutations: {
    setSettings(state, settings) {
      state.options = settings
    },
  },
  actions: {
    async fetchSettings({commit}) {
      commit('setSettings', await settings.all());
    },
    async saveSettings({commit, state}, options) {
      await settings.saveAll(options);
      commit('setSettings', {...state.options, ...options});
    },
  },
};

export default store;
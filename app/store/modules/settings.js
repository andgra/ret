import settings from '~models/settings';

const store = {
  namespaced: true,
  state: {
    settings: {}
  },
  mutations: {
    gotSettings(state, settings) {
      state.settings = settings
    }
  },
  actions: {
    async fetchSettings (context) {
      context.commit('gotSettings', await settings.all());
      console.log(context)
    }
  }
};

export default store;
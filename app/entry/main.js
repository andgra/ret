require('babel-polyfill');
import '~sass/main.scss';
import '~js/global';
import {nwin} from '~js/modules/nw';
import Promise from '~js/modules/promise';
import Vue from '~js/modules/vue';
import router from '~js/routes';
import store from "~store";
import {mapState, mapActions} from 'vuex';

// миграция для БД
import {migrate} from '~js/modules/migration';

if (IS_DEVELOPMENT) {
  nwin.showDevTools();
}

window.Promise = Promise;

console.log('core loaded');

require('~js/test');

let app = new Vue({
  data() {
    return {
      ready: false,
    };
  },
  router,
  store,
  computed: {
    ...mapState('settings', {settings: 'options'}),
  },
  methods: {
    ...mapActions('settings', ['fetchSettings', 'saveSettings']),
    ...mapActions('migration', ['checkMigrations']),
  },
  async created() {
    await this.fetchSettings();
    await migrate.call(this);
    this.ready = true;
  }
}).$mount('#app');

window.vm = app;

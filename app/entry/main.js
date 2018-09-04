require('babel-polyfill');
import '~sass/main.scss';
import '~js/global';
import {nwin} from '~js/modules/nw';
import Promise from '~js/modules/promise';
import Vue from '~js/modules/vue';
import router from '~js/routes';
import store from "~store";
import {mapState, mapActions} from 'vuex';

if (IS_DEVELOPMENT) {
  nwin.showDevTools();
}

window.Promise = Promise;

console.log('core loaded');

require('~js/test');

let app = new Vue({
  router,
  store,
  computed: {
    ...mapState('settings', {settings: 'options'}),
  },
  methods: {
    ...mapActions('settings', ['fetchSettings'])
  },
  created() {
    this.fetchSettings();
  }
}).$mount('#app');

window.vm = app;

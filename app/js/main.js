require('babel-polyfill');
import '~assets/sass/main.scss';
import "material-design-lite";
import '~js/bootstrap/jquery';
import '~js/bootstrap/helpers';
import {nwin} from '~js/modules/nw';
import Promise from '~js/modules/promise';
import Vue from '~js/modules/vue';
import router from '~js/routes';
import store from "~store";
import {mapState, mapActions} from 'vuex';

if (env === 'development') {
  nwin.showDevTools();
}
/*nwin.moveTo(1000, 0);
nwin.width(800);*/
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

window.appa = app;

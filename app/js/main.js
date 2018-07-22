import '~assets/sass/main.scss';
require('babel-polyfill');
import "material-design-lite";
import '~js/bootstrap/jquery';
import '~js/bootstrap/helpers';
import {nwin} from '~js/modules/nw';
import Vue from '~js/modules/vue';
import router from '~js/routes';
import {layout} from "vue-extend-layout";
import store from "~store";
import {mapState,mapActions} from 'vuex';
console.log(123,store);

nwin.showDevTools();
// var ngui = window.nwDispatcher.requireNwGui() ;
/*nwin.moveTo(1000, 0);
nwin.width(800);*/

console.log('core loaded');

require('~js/test');

let app = new Vue({
  router,
  store,
  computed: {
    ...mapState('settings', ['settings'])
  },
  methods: {
    ...mapActions('settings', ['fetchSettings'])
  },
  created() {

    this.fetchSettings().then(() => console.log(this.settings));
  },
  ...layout
}).$mount('#app');

window.appa = app;

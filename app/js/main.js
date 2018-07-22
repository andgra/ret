import '~assets/sass/main.scss';

require('babel-polyfill');
import "material-design-lite";

import '~js/modules/nw';
import '~js/modules/jquery';
import '~js/modules/tablefilter';
import '~js/modules/helpers';
import '~js/modules/print';
import '~js/modules/fs';
import '~js/modules/vue';
import {db} from '~js/model';

import router from '~js/routes';
import {layout} from "vue-extend-layout";

window.moment = require('moment');

window.db = db;


console.log('core loaded');

require('~js/test');

let app = new Vue({
  router,
  ...layout
}).$mount('#app');

window.appa = app;

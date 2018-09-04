import Vue from 'vue/dist/vue'
import VueMdl from 'vue-mdl';
import filters from '~js/modules/filters';
// import {openPdf, printContent} from '~js/modules/print';
import printMixins from '~mixins/print';
import objectMixins from '~mixins/object';
import valueMixins from '~mixins/value';

Vue.config.debug = true;

Vue.use(VueMdl);

Vue.filter('NaN', filters.NaN);
Vue.filter('per', filters.per);
Vue.filter('r0', filters.r0);
Vue.filter('r1', filters.r1);
Vue.filter('r2', filters.r2);
Vue.filter('myDate', filters.myDate);
Vue.filter('myDateTime', filters.myDateTime);
Vue.filter('myInterval', filters.myInterval);


Vue.mixin({
  computed: {
    isDevelopment() {
      return IS_DEVELOPMENT;
    }
  },
  methods: {
    ...printMixins,
    ...objectMixins,
    ...valueMixins,
    watchCollection(arr, cb, options) {
      arr.forEach((val) => this.$watch(val, cb, options))
    },
  }
});

// Регистрируем глобальную пользовательскую директиву `v-focus`
Vue.directive('focus', {
  // Когда привязанный элемент вставлен в DOM...
  inserted: function (el) {
    // Переключаем фокус на элемент
    el.focus()
  }
});

export default Vue;
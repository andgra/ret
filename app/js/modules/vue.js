import Vue from 'vue/dist/vue'
import VueMdl from 'vue-mdl';
import filters from '~js/modules/filters';

import moment from 'moment';

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
  methods: {
    watchCollection(arr, cb, options) {
      arr.forEach((val) => this.$watch(val, cb, options))
    }
  }
});

window.getColspan = Vue.getColspan = arr => {
  let res = 0;
  if (arr !== undefined) {
    for (let cell of arr) {
      res += cell.colspan;
    }
  }
  return res;
};

window.getInterval = Vue.getInterval = function (d1, d2) {
  d1 = moment(d1);
  d2 = moment(d2);
  return d1.diff(d2, 'minutes');
};
window.getIntervalString = Vue.getIntervalString = function (mins) {
  let data     = {};
  data.days    = Math.floor(Math.floor(mins / 60) / 24);
  data.hours   = Math.floor((mins) / 60) - data.days * 24;
  data.minutes = mins - (data.hours + data.days * 24) * 60;
  let result   = '';
  if (data.days && data.days > 0) {
    result += data.days + ' сут';
  }
  if (data.hours && data.hours > 0) {
    result = result + ((result.length > 0) ? ' ' : '') + data.hours + ' час';
  }
  if (data.minutes && data.minutes > 0) {
    result = result + ((result.length > 0) ? ' ' : '') + data.minutes + ' мин';
  }
  return result;
};
// Vue.getInObj = getInObj;
Vue.recValue = recValue;
Vue.mixin({
  computed: {
    isDevelopment() {
      return IS_DEVELOPMENT;
    }
  },
  methods: {
    updateByDots(obj, path, value) {
      let pathArr   = path.split('.');
      let childPath = pathArr.pop();
      let parent    = getInObj(obj, pathArr.join('.'));

      parent[childPath] = value;

      return obj;
    },
    formattedTitle(title) {
      return title.replace(/\<br\>/, ' ').replace('\s+', ' ');
    },
    getInObj: getInObj,
    getItems(path) {
      let items = getInObj(this.info, path);
      if (items) {
        return items.map(item => (item.value));
      }
      return null;
    },
    getValue({row, path, cols}) {
      let value   = getInObj(row, path);
      let options = cols.filter(item => {return item.id && item.id === path}).first();
      if (options) {
        if (options.type === 'interval') {
          value = getIntervalString(value)
        } else if (options.type === 'datetime') {
          value = moment(value).isValid() ? moment(value).format('DD.MM.YYYY HH:mm') : '';
        } else if (options.type === 'date') {
          value = moment(value).isValid() ? moment(value).format('DD.MM.YYYY') : '';
        } else if (options.cb) {
          value = options.cb(value, row);
        }

        if (options.format) {
          value = options.format(value);
        }
      }
      return value;
    }
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
import Vue from 'vue/dist/vue'
import VueMdl from 'vue-mdl';
import DateTimePicker from "~components/datetimepicker.vue";
import 'mdl-selectfield/dist/mdl-selectfield';

import MdlSelect from "~components/select.vue";
import 'jquery-ui/ui/widgets/autocomplete';

import MdlAutocomplete from "~components/autocomplete.vue";
import IntervalPicker from "~components/intervalpicker.vue";
import filters from '~js/modules/filters';
import SmartTable from '~components/smart-table/main.vue';
import Loading from '~components/loading.vue';

import moment from 'moment';

Vue.config.debug = true;

Vue.use(VueMdl);

Vue.component('DateTimePicker', DateTimePicker);

Vue.component('mdl-select', MdlSelect);

Vue.component('mdl-autocomplete', MdlAutocomplete);

Vue.component('IntervalPicker', IntervalPicker);

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

Vue.directive('deep-model', {
  bind(el, binding, vnode) {
    let onUpdate = e => {
      new Function('obj', 'v', `obj.${binding.value} = v`)(vnode.context.$data, e.target.value);
    };
    el.addEventListener('input', onUpdate);
    el.addEventListener('change', onUpdate);
    if (el.type === 'hidden') {
      el.addEventListener('change', () => alert(1));
    }
  },
  unbind(el) {
    el.removeEventListener('input');
    el.removeEventListener('change');
  },
  inserted(el, binding, vnode) {
    el.value = new Function('obj', `return obj.${binding.value}`)(vnode.context.$data);
  },
  update(el, binding, vnode) {
    el.value = new Function('obj', `return obj.${binding.value}`)(vnode.context.$data);
    if (el.value) {
      $(el).closest('.mdl-textfield').addClass('is-dirty');
    } else {
      $(el).closest('.mdl-textfield').removeClass('is-dirty');
    }
  }
});

window.getColspan = Vue.getColspan = arr => {
  let res = 0;
  for (let cell of arr) {
    res += cell.colspan;
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
Vue.getInObj = getInObj;
Vue.recValue = recValue;
Vue.mixin({
  methods: {
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

Vue.component('smart-table', SmartTable);

Vue.component('loading', Loading);

// Регистрируем глобальную пользовательскую директиву `v-focus`
Vue.directive('focus', {
  // Когда привязанный элемент вставлен в DOM...
  inserted: function (el) {
    // Переключаем фокус на элемент
    el.focus()
  }
});

export default Vue;
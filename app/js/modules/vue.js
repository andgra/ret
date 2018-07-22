window.Vue = require("vue/dist/vue.js");
Vue.config.debug = true;

import VueMdl from 'vue-mdl';
Vue.use(VueMdl);

import DateTimePicker from "~components/datetimepicker.vue";
Vue.component('DateTimePicker', DateTimePicker);

import 'mdl-selectfield/dist/mdl-selectfield';

import MdlSelect from "~components/select.vue";
Vue.component('mdl-select', MdlSelect);

import 'jquery-ui/ui/widgets/autocomplete';

import MdlAutocomplete from "~components/autocomplete.vue";
Vue.component('mdl-autocomplete', MdlAutocomplete);

import IntervalPicker from "~components/intervalpicker.vue";
Vue.component('IntervalPicker', IntervalPicker);

Number.prototype.round = function(places) {
    places = Math.pow(10, places);
    return Math.round(this * places) / places;
};

import filters from '~js/filters';

Vue.filter('NaN', filters.NaN );
Vue.filter('per', filters.per );
Vue.filter('r0', filters.r0 );
Vue.filter('r1', filters.r1 );
Vue.filter('r2', filters.r2 );
Vue.filter('myDate', filters.myDate );
Vue.filter('myDateTime', filters.myDateTime );
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
        if(el.type==='hidden') {
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
        if(el.value) {
            $(el).closest('.mdl-textfield').addClass('is-dirty');
        } else {
            $(el).closest('.mdl-textfield').removeClass('is-dirty');
        }
    }
});

import SmartTable from '~components/smart-table/main.vue';
Vue.component('smart-table', SmartTable);

import Loading from '~components/loading.vue';
Vue.component('loading', Loading);

// Регистрируем глобальную пользовательскую директиву `v-focus`
Vue.directive('focus', {
  // Когда привязанный элемент вставлен в DOM...
  inserted: function (el) {
    // Переключаем фокус на элемент
    el.focus()
  }
})

export default Vue;
window.Vue = require("vue/dist/vue.js");
Vue.config.debug = true;

import VueMdl from 'vue-mdl';
Vue.use(VueMdl);

import DateTimePicker from "@/common/datetimepicker.vue";
Vue.component('DateTimePicker', DateTimePicker);

import 'mdl-selectfield/dist/mdl-selectfield';
import MdlSelect from "@/common/select.vue";
Vue.component('mdl-select', MdlSelect);

import 'jquery-ui/ui/widgets/autocomplete';
import MdlAutocomplete from "@/common/autocomplete.vue";
Vue.component('mdl-autocomplete', MdlAutocomplete);

import IntervalPicker from "@/common/intervalpicker.vue";
Vue.component('IntervalPicker', IntervalPicker);

Number.prototype.round = places => {
    places = Math.pow(10, places);
    return Math.round(this * places) / places;
};

window.filters = {
    NaN: value => (isNaN(value) ? 0 : value),
    per(value) {
        return isNumeric(value) ? value + '%' : value;
    },
    r0(value) {
        return isNumeric(value) ? value.round(0) : value;
    },
    r2(value) {
        return isNumeric(value) ? value.round(2) : value;
    },
    myDate(value) {
        return value ? moment(value).format('DD.MM.YYYY') : '';
    },
    myDateTime(value) {
        return value ? moment(value).format('DD.MM.YYYY HH:mm') : '';
    },
    myInterval(value) {
        let data = {};
        data.days = Math.floor(Math.floor(value / 60) / 24);
        data.hours = Math.floor((value) / 60) - data.days * 24;
        data.minutes = value - (data.hours + data.days * 24) * 60;
        let result = '';
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
    },
};

Vue.filter('NaN', filters.NaN );
Vue.filter('per', filters.per );
Vue.filter('r0', filters.r0 );
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
window.ngui = require('nw.gui');
window.nwin = ngui.Window.get();
window.fs = require("fs");


// window.jsPDF = require('jspdf');
window.$ = window.jQuery = require('jquery');
/*TablesawConfig  = {
    getHeaderCells: function() {
        return this.$table.find( ".sortable" );
    }
};*/
/*window.Tablesaw = */require('tablesaw/dist/tablesaw.jquery');
require('tablesaw/dist/tablesaw-init');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/ui/widgets/datepicker');
require('jquery-datetimepicker');
$.datepicker.setDefaults($.datepicker.regional['ru']);
$.datetimepicker.setLocale('ru');


console.log(ngui,nwin);

window.isNumeric = function (n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

window.getObjRec = function(obj, path) {
    path = path.split('.');
    let res = JSON.parse(JSON.stringify(obj));
    path.forEach((p) => {
        res = res[p];
    });
    return res;
};

window.openPdf = function(name) {
    ngui.Window.open('index.html?route='+name,{show: false});
};

fs.rmRf = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                fs.rmRf(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};



window.getRequests = function() {
    var s1 = location.search.substring(1, location.search.length).split('&'),
        r = {}, s2, i;
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=');
        r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
    }
    return r;
};


// import '../sass/main.scss'

const asset = function (path) {
    return window.__dirname + '/public/' + path;
};
const asset_src = function (path) {
    return window.__dirname + '/src/' + path;
};
const Datastore = require('nedb');
window.moment = require('moment');
window.db = new Datastore({filename: window.__dirname + '/database/db.json', timestampData: true, autoload: true});
const Mdl = require("material-design-lite");
window.Vue = require("vue/dist/vue.js");

const VueMdl = require("vue-mdl");
Vue.use(VueMdl.default);

const DatePicker = require("../components/common/datepicker.vue");
Vue.component('DatePicker', DatePicker);

const DateTimePicker = require("../components/common/datetimepicker.vue");
Vue.component('DateTimePicker', DateTimePicker);

const IntervalPicker = require("../components/common/intervalpicker.vue");
Vue.component('IntervalPicker', IntervalPicker);




Number.prototype.round = function(places){
    places = Math.pow(10, places);
    return Math.round(this * places)/places;
}

Vue.filter('NaN', function (value) {
    return isNaN(value) ? 0 : value;
});

Vue.filter('per', function (value) {
    return isNumeric(value) ? value+'%' : value;
});

Vue.filter('r0', function (value) {
    return isNumeric(value) ? value.round(0) : value;
});

Vue.filter('r2', function (value) {
    return isNumeric(value) ? value.round(2) : value;
});

Vue.filter('myDate', function (value) {
    return value?moment(value).format('DD.MM.YYYY'):'';
});

Vue.filter('myDateTime', function (value) {
    return value?moment(value).format('DD.MM.YYYY HH:mm'):'';
});

window.strInterval = function(value) {

    let data = {};
    data.days = Math.floor(Math.floor(value/60)/24);
    data.hours = Math.floor((value)/60) - data.days*24;
    data.minutes = value - (data.hours + data.days*24)*60;
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
};

Vue.filter('myInterval', function (value) {
    return strInterval(value);
});

Vue.mixin({
    methods: {
        watchCollection(arr, cb, options) {
            arr.forEach((val) => this.$watch(val, cb, options))
        }
    }
});

window.compareNumbers = function (a, b) {
    return a - b;
};

window.isArray = function (v) {
    return v instanceof Array;
};

window.isObject = function(mixed_var) {
    if(mixed_var instanceof Array) {
        return false;
    } else {
        return (mixed_var !== null) && (typeof( mixed_var ) === 'object');
    }
};

window.isFunction = function(functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

window.compareNumbers = function (a, b) {
    return a - b;
};

window.recValue = function(arr, value) {
    arr = JSON.parse(JSON.stringify(arr));
    for(let i in arr) {
        if(isArray(arr[i]) || isObject(arr[i])) {
            arr[i] = recValue(arr[i], value);
        } else {
            arr[i] = value;
        }
    }
    return arr;
};


console.log('core loaded');
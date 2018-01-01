window.ngui = require('nw.gui');
window.nwin = ngui.Window.get();
nwin.maximize();
window.fs = require("fs");


window.$ = window.jQuery = require('jquery');
require('tablesaw/dist/tablesaw.jquery');
require('tablesaw/dist/tablesaw-init');
window.TableFilter = require('tablefilter');
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

window.getInObj = function(obj, path) {
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
    let s1 = location.search.substring(1, location.search.length).split('&'),
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

window.shellSort = function(arr,compareFunc)
{
    let n = arr.length, i = Math.floor(n/2);
    while (i > 0)
    { for (let j = 0; j < n; j++)
    { let k = j, t = arr[j];
        while (k >= i && compareFunc(arr[k-i],t))
        { Vue.set(arr,k,arr[k-i]); k -= i; }
        Vue.set(arr,k,t);
    }
        i = (i===2) ? 1 : Math.floor(i*5/11);
    }
    return arr;
};

window.quickSort = function(arr,compareFunc)
{
    if (arr.length === 0) return [];
    let a = [], b = [], p = arr[0];
    for (let i = 1; i < arr.length; i++)
    { if (compareFunc(p,arr[i])) a[a.length] = arr[i];
    else b[b.length] = arr[i];
    }
    return quickSort(a,compareFunc).concat( p,quickSort(b,compareFunc) );
};


window.bubbleSort = function(arr,compareFunc){
    let len = arr.length;
    for(let i =0;i<len;i++){
        for(let j= i+1;j<len;j++){
            if(compareFunc(arr[i],arr[j])){
                let swap = arr[i];
                Vue.set(arr,i,arr[j]);
                Vue.set(arr,j,swap);
            }
        }
    }
    return arr;
};


window.mergeSort = function(array, comparefn) {
    function merge(arr, aux, lo, mid, hi, comparefn) {
        var i = lo;
        var j = mid + 1;
        var k = lo;
        while(true){
            var cmp = comparefn(arr[i], arr[j]);
            if(cmp <= 0){
                aux[k++] = arr[i++];
                if(i > mid){
                    do
                        aux[k++] = arr[j++];
                    while(j <= hi);
                    break;
                }
            } else {
                aux[k++] = arr[j++];
                if(j > hi){
                    do
                        aux[k++] = arr[i++];
                    while(i <= mid);
                    break;
                }
            }
        }
    }

    function sortarrtoaux(arr, aux, lo, hi, comparefn) {
        if (hi < lo) return;
        if (hi == lo){
            aux[lo] = arr[lo];
            return;
        }
        var mid = Math.floor(lo + (hi - lo) / 2);
        sortarrtoarr(arr, aux, lo, mid, comparefn);
        sortarrtoarr(arr, aux, mid + 1, hi, comparefn);
        merge(arr, aux, lo, mid, hi, comparefn);
    }

    function sortarrtoarr(arr, aux, lo, hi, comparefn) {
        if (hi <= lo) return;
        var mid = Math.floor(lo + (hi - lo) / 2);
        sortarrtoaux(arr, aux, lo, mid, comparefn);
        sortarrtoaux(arr, aux, mid + 1, hi, comparefn);
        merge(aux, arr, lo, mid, hi, comparefn);
    }

    function merge_sort(arr, comparefn) {
        var aux = arr.slice(0);
        sortarrtoarr(arr, aux, 0, arr.length - 1, comparefn);
        return arr;
    }

    return merge_sort(array, comparefn);
}

console.log('core loaded');
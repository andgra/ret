window.ngui = require('nw.gui');
window.nwin = ngui.Window.get();
console.log(nwin.appWindow.hidden);
// nwin.showDevTools();
window.fs = require("fs");
import '../sass/main.scss';


window.$ = window.jQuery = require('jquery');
require('tablesaw/dist/tablesaw.jquery');
// require('tablesaw/dist/tablesaw-init');
window.TableFilter = require('tablefilter');
TableFilter.prototype.refresh = function () {
    this.destroy();
    this.init();
};
TableFilter.prototype.refreshFilters = function () {
    let slcA1 = this.getFiltersByType('select', true),
        slcA2 = this.getFiltersByType('multiple', true),
        slcA3 = this.getFiltersByType('checklist', true),
        slcIndex = slcA1.concat(slcA2);
    slcIndex = slcIndex.concat(slcA3);

    slcIndex.forEach((colIdx) => {
        let curSlc = this.getFilterElement(colIdx);
        this.Mod.dropdown.init(colIdx, this.isExternalFlt(), curSlc);

    });
};
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/button');
require('jquery-datetimepicker');
$.datetimepicker.setLocale('ru');


console.log(ngui, nwin);

window.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

window.getInObj = function (obj, path, cloneRes = false) {
    path = path.split('.');
    let res = cloneRes ? clone(obj) : obj;
    for(let p of path) {
        res = res[p];
        if(res === undefined || res === null) {
            break;
        }
    }
    return res;
};

window.openPdf = function (name) {
    ngui.Window.open('public/index.html?route=' + name, { width: 1,height: 1, show: false});
};

window.printContent = (name, landscape = false) => {
    let dir = ngui.__dirname+'/print';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let pdf_path = `${dir}/${name}.pdf`;
    nwin.print({
        headerFooterEnabled: false,
        landscape: landscape,
        pdf_path
    });
    ngui.Window.open(pdf_path,{ width: 8000,height: 6000}, function(win) {
        fs.rmRf(dir);
    });
    nwin.close();
};

fs.rmRf = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
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


window.getRequests = function () {
    let s1 = location.search.substring(1, location.search.length).split('&'),
        r = {}, s2, i;
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=');
        r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
    }
    return r;
};

window.getSeed = (node) => {
    if (node.children) {
        let res = {};
        for (let i in node.children) {
            let name = node.children[i].id;
            res[name] = getSeed(node.children[i]);
        }
        return res;
    } else {
        return node.default !== undefined ? node.default : "";
    }
};


window.leavesCnt = (node) => {
    if (node.children) {
        let curArr = clone(node.children);
        let curLeaves = 0;
        for (let i in curArr) {
            curLeaves += leavesCnt(curArr[i]);
        }
        return curLeaves;
    } else {
        return 1;
    }
};

function getMaxDepth(arr, lvl = 1) {
    let curMax = lvl;
    let max = lvl;
    for (let i in arr) {
        if (arr[i].children) {
            curMax = getMaxDepth(arr[i].children, lvl + 1);
        }
        max = max < curMax ? curMax : max;
    }
    return max
}


window.getUnited = (struct) => {
    function setIds(arr, chain="") {
        let curArr = clone(arr);
        let curChain;
        for (let i in curArr) {
            curChain = chain;
            if(curArr[i].id) {
                curChain+=((curChain===""?"":".")+String(curArr[i].id));
                curArr[i].id = curChain
            }
            if (curArr[i].children) {
                curArr[i].children = setIds(curArr[i].children,curChain);
            }
        }
        return curArr;
    }

    function normalizeStruct(arr) {
        let curArr = clone(arr);
        let toShift = true;
        let newArr = [];
        for (let i in curArr) {
            if (curArr[i].children) {
                if (curArr[i].title !== "") {
                    toShift = false;
                }
                curArr[i].children.forEach(node => newArr.push(node))
            } else {
                toShift = false;
            }
        }
        if (!toShift) {
            newArr = curArr;
        }
        for (let i in newArr) {
            if (newArr[i].children) {
                newArr[i].children = normalizeStruct(newArr[i].children);
            }
        }
        return newArr;
    }

    function shiftStruct(arr, maxLvl = getMaxDepth(arr), lvl = 1) {
        let curArr = clone(arr);
        for (let i in curArr) {
            let shifted = false;
            if (curArr[i].children) {
                if (lvl + getMaxDepth(curArr[i].children) < maxLvl) {
                    shifted = true
                }
            } else {
                if (lvl < maxLvl) {
                    shifted = true
                }
            }

            if (shifted) {
                curArr[i] = {
                    title: "",
                    children: [
                        curArr[i]
                    ]
                };
            }
            if (curArr[i].children)
                curArr[i].children = shiftStruct(curArr[i].children, maxLvl, lvl + 1);
        }
        return curArr;
    }

    function unionStruct(shifted) {
        function unite(arr) {
            let newNode = {
                title: "",
                children: []
            };
            for (let i in arr) {
                if (arr[i].children) {
                    arr[i].children.forEach(node => newNode.children.push(node))
                } else {
                    newNode.children.push(arr[i]);
                }
            }
            return newNode
        }

        let curArr = clone(shifted);

        let toUnite = [];
        let newArr = [];
        for (let i in curArr) {
            let cur = clone(curArr[i]);
            if (cur.title === "") {
                toUnite.push(cur);
            } else {
                if (toUnite.length) {
                    newArr.push(unite(toUnite));
                    toUnite = [];
                }
                newArr.push(cur);
            }
        }
        if (toUnite.length) {
            newArr.push(unite(toUnite));
        }
        for (let i in newArr) {
            if (newArr[i].children) {
                newArr[i].children = unionStruct(newArr[i].children);
            }
        }
        return newArr;
    }


    let withIds = setIds(struct)
// console.log('withIds', withIds);

    let normalized = normalizeStruct(withIds);
// console.log('normalized', normalized);

    let shifted = shiftStruct(normalized);
// console.log('shifted',shifted)

    return unionStruct(shifted);
};


window.getGrid = (united) => {
    let depth = getMaxDepth(united);
    let resArr = [];
    let curArr = clone(united);
    let nextArr = [];
    for (let lvl = 0; lvl < depth; lvl++) {
        resArr[lvl] = [];
        for (let i in curArr) {
            let cell = clone(curArr[i]);
            cell.colspan = leavesCnt(cell);
            delete cell.children;
            resArr[lvl].push(cell)
            if (curArr[i].children) {
                curArr[i].children.forEach(node => nextArr.push(node))
            }
        }
        curArr = clone(nextArr);
        nextArr = [];
    }
    return resArr;
};


// import '../sass/main.scss'

const asset = function (path) {
    return window.__dirname + '/public/' + path;
};
const asset_src = function (path) {
    return window.__dirname + '/src/' + path;
};


import {db} from 'core/model';
window.db = db;

window.moment = require('moment');
import "material-design-lite";


window.compareNumbers = function (a, b) {
    return a - b;
};

window.isArray = function (v) {
    return v instanceof Array;
};

window.isObject = function (mixed_var) {
    if (mixed_var instanceof Array) {
        return false;
    } else {
        return (mixed_var !== null) && (typeof( mixed_var ) === 'object');
    }
};

window.isFunction = function (functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

window.compareNumbers = function (a, b) {
    return a - b;
};

window.recValue = function (arr, value) {
    arr = clone(arr);
    for (let i in arr) {
        if (isArray(arr[i]) || isObject(arr[i])) {
            arr[i] = recValue(arr[i], value);
        } else {
            arr[i] = value;
        }
    }
    return arr;
};

window.shellSort = function (arr, compareFunc) {
    let n = arr.length, i = Math.floor(n / 2);
    while (i > 0) {
        for (let j = 0; j < n; j++) {
            let k = j, t = arr[j];
            while (k >= i && compareFunc(arr[k - i], t)) {
                Vue.set(arr, k, arr[k - i]);
                k -= i;
            }
            Vue.set(arr, k, t);
        }
        i = (i === 2) ? 1 : Math.floor(i * 5 / 11);
    }
    return arr;
};

window.quickSort = function (arr, compareFunc) {
    if (arr.length === 0) return [];
    let a = [], b = [], p = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (compareFunc(p, arr[i])) a[a.length] = arr[i];
        else b[b.length] = arr[i];
    }
    return quickSort(a, compareFunc).concat(p, quickSort(b, compareFunc));
};


window.bubbleSort = function (arr, compareFunc) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (compareFunc(arr[i], arr[j])) {
                let swap = arr[i];
                Vue.set(arr, i, arr[j]);
                Vue.set(arr, j, swap);
            }
        }
    }
    return arr;
};


window.mergeSort = function (array, comparefn) {
    function merge(arr, aux, lo, mid, hi, comparefn) {
        var i = lo;
        var j = mid + 1;
        var k = lo;
        while (true) {
            var cmp = comparefn(arr[i], arr[j]);
            if (cmp <= 0) {
                aux[k++] = arr[i++];
                if (i > mid) {
                    do
                        aux[k++] = arr[j++];
                    while (j <= hi);
                    break;
                }
            } else {
                aux[k++] = arr[j++];
                if (j > hi) {
                    do
                        aux[k++] = arr[i++];
                    while (i <= mid);
                    break;
                }
            }
        }
    }

    function sortarrtoaux(arr, aux, lo, hi, comparefn) {
        if (hi < lo) return;
        if (hi == lo) {
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
};

Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    value: function() { return this[this.length - 1]; }
});

Object.defineProperty(Array.prototype, 'first', {
    enumerable: false,
    value: function() { return this[0]; }
});

window.clone = (item) => {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ],
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) {
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
};


import 'core/_vue';

console.log('core loaded');